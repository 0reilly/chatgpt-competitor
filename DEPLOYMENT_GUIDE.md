# Deployment Guide: Payment Integration

This guide walks you through setting up the payment integration for the ChatGPT competitor application.

## 💳 Stripe Setup

### 1. Create a Stripe Account
- Go to [Stripe Dashboard](https://dashboard.stripe.com)
- Create a new account or log in to existing account
- Get your API keys from the Developer section

### 2. Set Up Products
Create the following products in your Stripe Dashboard:

#### Product 1: AI Chat Pro
- **Name**: "AI Chat Pro"
- **Description**: "Professional AI chat with 100K tokens per month"
- **Pricing**: $9.99/month (recurring)
- **Features**: All AI models, priority access, advanced features

#### Product 2: AI Chat Enterprise  
- **Name**: "AI Chat Enterprise"
- **Description**: "Enterprise AI chat with 1M tokens per month"
- **Pricing**: $49.99/month (recurring)
- **Features**: Custom models, API access, dedicated support

#### Product 3: AI Chat Token Pack
- **Name**: "AI Chat Token Pack"
- **Description**: "Additional token pack for free users"
- **Pricing**: $4.99 (one-time)

### 3. Configure Environment Variables

Update your `.env` file with the actual Stripe product IDs:

```bash
# Stripe Configuration (LIVE KEYS)
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key

# Stripe Product IDs (Update with actual IDs from Stripe Dashboard)
STRIPE_PRO_PRICE_ID=price_your_actual_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_actual_enterprise_price_id
STRIPE_TOKEN_PACK_PRICE_ID=price_your_actual_token_pack_price_id

# Stripe Webhook Secret (Optional for production)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 4. Set Up Webhooks (Optional)

For production, set up webhooks to handle payment events:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events to listen for:
   - `payment_intent.succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## 🚀 Testing the Payment Flow

### 1. Test with Stripe Test Mode

1. Switch to test mode in Stripe Dashboard
2. Use test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Requires authentication**: `4000 0025 0000 3155`
   - **Declined**: `4000 0000 0000 0002`

### 2. Test Payment Flow

1. Start the application: `./start.sh`
2. Navigate to the web interface
3. Click "Upgrade" button
4. Select a plan and use test card number
5. Complete the payment process
6. Verify user tier is updated

## 🎯 Production Deployment

### 1. Environment Setup

Ensure your production environment has:

```bash
# Production Environment Variables
NODE_ENV=production
DEEPSEEK_API_KEY=your_production_api_key
STRIPE_SECRET_KEY=sk_live_your_production_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_production_publishable_key
JWT_SECRET=your_secure_jwt_secret
DATABASE_URL=your_production_database_url
```

### 2. Frontend Configuration

Update frontend environment variables:

```javascript
// In production build, ensure these are set:
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
REACT_APP_STRIPE_PRO_PRICE_ID=price_your_pro_price_id
REACT_APP_STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id
```

### 3. Security Considerations

- Never commit API keys or secrets to version control
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Set up proper CORS configuration
- Implement rate limiting
- Use Stripe's fraud detection features

## 📋 API Endpoints

### Payment Endpoints

- `GET /api/stripe/config` - Get Stripe publishable key
- `POST /api/stripe/create-customer` - Create Stripe customer
- `POST /api/stripe/create-subscription` - Create subscription
- `POST /api/stripe/create-checkout-session` - Create checkout session
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `GET /api/stripe/products` - Get Stripe products
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### User Management

- `POST /api/user/:userId/upgrade` - Upgrade user tier
- `GET /api/user/:userId/stats` - Get user usage stats

## 📊 Monitoring and Analytics

### Key Metrics to Track

- **Revenue**: Monthly recurring revenue (MRR)
- **Conversion rate**: Free to paid user conversion
- **Churn rate**: Subscription cancellation rate
- **Usage patterns**: Token usage by tier
- **Payment success rate**: Successful vs failed payments

### Stripe Dashboard

Monitor in Stripe Dashboard:
- Payment success/failure rates
- Subscription metrics
- Revenue analytics
- Customer lifetime value

## 📝 Troubleshooting

### Common Issues

1. **Payment fails**
   - Check Stripe API keys
   - Verify product IDs
   - Test with Stripe test cards

2. **Webhook errors**
   - Verify webhook secret
   - Check endpoint URL
   - Monitor Stripe dashboard for webhook failures

3. **User not upgraded**
   - Check webhook handling
   - Verify user session updates
   - Check payment success status

### Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Webhook Guide](https://stripe.com/docs/webhooks)

## ✅ Success Checklist

- [ ] Stripe account created and verified
- [ ] Products configured in Stripe Dashboard
- [ ] Environment variables updated with real keys
- [ ] Payment flow tested with test cards
- [ ] Webhooks configured (optional)
- [ ] Production environment variables set
- [ ] Security measures implemented
- [ ] Monitoring set up
- [ ] Team trained on payment process

---

**⚡️ Ready to accept real payments!**