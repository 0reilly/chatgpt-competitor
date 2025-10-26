require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const DeepSeekClient = require('./deepseek-client');
const PricingService = require('./pricing-service');
const StripeService = require('./stripe-service');
const stripeRoutes = require('./stripe-routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize services
const deepseekClient = new DeepSeekClient(process.env.DEEPSEEK_API_KEY);
const pricingService = new PricingService();
const stripeService = new StripeService(
  process.env.STRIPE_SECRET_KEY,
  process.env.STRIPE_PUBLISHABLE_KEY
);

// Make services available to routes
app.use((req, res, next) => {
  req.deepseekClient = deepseekClient;
  req.pricingService = pricingService;
  req.stripeService = stripeService;
  next();
});

// In-memory storage for demo (replace with database in production)
const userSessions = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, temperature, max_tokens, userId = 'demo-user' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Messages array is required'
      });
    }

    // Get or create user session
    if (!userSessions.has(userId)) {
      userSessions.set(userId, {
        tier: 'free',
        monthlyUsage: 0,
        transactions: [],
        stripeCustomerId: null
      });
    }
    const userSession = userSessions.get(userId);

    // Check usage limits
    const usageStatus = pricingService.checkUsageLimit(userSession.monthlyUsage, userSession.tier);
    if (!usageStatus.canUse) {
      return res.status(429).json({
        error: 'Monthly usage limit exceeded',
        tier: userSession.tier,
        usageStatus
      });
    }

    // Make API call to DeepSeek
    const result = await deepseekClient.chat({
      messages,
      model: model || 'deepseek-chat',
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1000
    });

    if (!result.success) {
      return res.status(500).json({
        error: result.error
      });
    }

    // Calculate cost and update usage
    const cost = pricingService.calculateCost(result.usage);
    const price = pricingService.calculatePrice(result.usage);
    const profit = pricingService.calculateProfit(result.usage);

    userSession.monthlyUsage += result.usage.total_tokens;
    userSession.transactions.push({
      timestamp: new Date(),
      tokens: result.usage.total_tokens,
      cost,
      price,
      profit
    });

    // Return response
    res.json({
      message: result.data.choices[0].message,
      usage: result.usage,
      cost,
      price,
      profit,
      usageStatus: pricingService.checkUsageLimit(userSession.monthlyUsage, userSession.tier)
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Models endpoint
app.get('/api/models', async (req, res) => {
  try {
    const result = await deepseekClient.getModels();

    if (!result.success) {
      return res.status(500).json({
        error: result.error
      });
    }

    res.json({
      models: result.data.data
    });

  } catch (error) {
    console.error('Models endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Pricing tiers endpoint
app.get('/api/pricing', (req, res) => {
  const tiers = pricingService.getPricingTiers();
  res.json({ tiers });
});

// User stats endpoint
app.get('/api/user/:userId/stats', (req, res) => {
  const { userId } = req.params;
  
  if (!userSessions.has(userId)) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  const userSession = userSessions.get(userId);
  const usageStats = pricingService.getUsageStats(userSession.transactions);
  const usageStatus = pricingService.checkUsageLimit(userSession.monthlyUsage, userSession.tier);

  res.json({
    userId,
    tier: userSession.tier,
    usageStatus,
    stats: usageStats
  });
});

// Upgrade endpoint
app.post('/api/user/:userId/upgrade', (req, res) => {
  const { userId } = req.params;
  const { tier } = req.body;

  if (!userSessions.has(userId)) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  const userSession = userSessions.get(userId);
  
  // In a real app, you would verify payment before upgrading
  userSession.tier = tier;
  userSession.monthlyUsage = 0; // Reset usage for new billing cycle

  res.json({
    success: true,
    message: `Upgraded to ${tier} tier`,
    tier: userSession.tier
  });
});

// Stripe payment routes
app.use('/api/stripe', stripeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

module.exports = app;