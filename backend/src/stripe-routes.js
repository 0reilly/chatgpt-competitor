const express = require('express');
const router = express.Router();

/**
 * Stripe payment routes
 */

// Get Stripe publishable key
router.get('/config', (req, res) => {
  try {
    const publishableKey = req.stripeService.getPublishableKey();
    res.json({
      publishableKey
    });
  } catch (error) {
    console.error('Stripe config error:', error);
    res.status(500).json({
      error: 'Failed to get Stripe configuration'
    });
  }
});

// Create a Stripe customer
router.post('/create-customer', async (req, res) => {
  try {
    const { email, name, userId } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    const result = await req.stripeService.createCustomer({
      email,
      name,
      userId
    });

    if (!result.success) {
      return res.status(500).json({
        error: result.error
      });
    }

    res.json({
      customerId: result.customer.id,
      customer: result.customer
    });

  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      error: 'Failed to create customer'
    });
  }
});

// Create a subscription
router.post('/create-subscription', async (req, res) => {
  try {
    const { customerId, priceId } = req.body;

    if (!customerId || !priceId) {
      return res.status(400).json({
        error: 'Customer ID and Price ID are required'
      });
    }

    const result = await req.stripeService.createSubscription(customerId, priceId);

    if (!result.success) {
      return res.status(500).json({
        error: result.error
      });
    }

    res.json({
      subscriptionId: result.subscription.id,
      clientSecret: result.clientSecret,
      subscription: result.subscription
    });

  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      error: 'Failed to create subscription'
    });
  }
});

// Create a checkout session for one-time payment
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { 
      customerId, 
      priceId, 
      successUrl, 
      cancelUrl,
      userId,
      tokens
    } = req.body;

    if (!priceId) {
      return res.status(400).json({
        error: 'Price ID is required'
      });
    }

    const result = await req.stripeService.createCheckoutSession({
      customerId,
      priceId,
      successUrl: successUrl || `${req.protocol}://${req.get('host')}/success`,
      cancelUrl: cancelUrl || `${req.protocol}://${req.get('host')}/cancel`,
      userId,
      tokens
    });

    if (!result.success) {
      return res.status(500).json({
        error: result.error
      });
    }

    res.json({
      sessionId: result.session.id,
      url: result.session.url
    });

  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session'
    });
  }
});

// Create a payment intent for usage-based billing
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { customerId, amount, userId, tokens } = req.body;

    if (!amount || !customerId) {
      return res.status(400).json({
        error: 'Amount and customer ID are required'
      });
    }

    const result = await req.stripeService.createPaymentIntent({
      customerId,
      amount: Math.round(amount * 100), // Convert to cents
      userId,
      tokens: tokens || 0
    });

    if (!result.success) {
      return res.status(500).json({
        error: result.error
      });
    }

    res.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      error: 'Failed to create payment intent'
    });
  }
});

// Get Stripe products
router.get('/products', async (req, res) => {
  try {
    const result = await req.stripeService.getProducts();

    if (!result.success) {
      return res.status(500).json({
        error: result.error
      });
    }

    res.json({
      products: result.products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Failed to get products'
    });
  }
});

// Handle Stripe webhooks
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    
    const result = await req.stripeService.handleWebhook(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (!result.success) {
      return res.status(400).json({
        error: result.error
      });
    }

    const event = result.event;

    // Handle different webhook events
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        // Update user balance or process successful payment
        break;
      
      case 'customer.subscription.created':
        console.log('Subscription created:', event.data.object.id);
        // Update user tier
        break;
      
      case 'customer.subscription.updated':
        console.log('Subscription updated:', event.data.object.id);
        // Update user tier if needed
        break;
      
      case 'customer.subscription.deleted':
        console.log('Subscription canceled:', event.data.object.id);
        // Downgrade user to free tier
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      error: 'Webhook error'
    });
  }
});

module.exports = router;