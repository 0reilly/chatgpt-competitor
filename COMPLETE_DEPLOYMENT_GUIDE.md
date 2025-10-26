# Complete Deployment Guide: ChatGPT Competitor

## Overview
This guide provides step-by-step instructions to deploy your ChatGPT competitor app to DigitalOcean.

## Prerequisites
- DigitalOcean account
- GitHub repository with clean code (no secret violations)
- DeepSeek API key
- Stripe account with API keys

## Step 1: Manual DigitalOcean Deployment

### Via DigitalOcean UI:
1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Choose "GitHub" as source
4. Authorize DigitalOcean to access your GitHub account
5. Select repository: `0reilly/chatgpt-competitor`
6. Select branch: `main`
7. Configure build settings:
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
   - **HTTP Port**: `3000`

## Step 2: Environment Variables
Set these in DigitalOcean App Settings:

```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=production
```

## Step 3: Payment Configuration

### Stripe Setup:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Enable test mode
3. Get your API keys from Developers > API keys
4. Configure webhooks:
   - Endpoint URL: `https://your-app.ondigitalocean.app/api/webhook`
   - Events to listen for: `checkout.session.completed`

## Step 4: Testing
1. Access your app at the provided DigitalOcean URL
2. Test chat functionality
3. Test payment flow
4. Verify webhook responses

## Troubleshooting

### Common Issues:
- **Build failures**: Check build logs in DigitalOcean
- **API errors**: Verify environment variables
- **Payment issues**: Check Stripe dashboard for webhook events

## Cost Estimation
- DigitalOcean App: ~$5-10/month
- DeepSeek API: Pay-per-use
- Stripe: 2.9% + $0.30 per transaction

## Next Steps
1. Monitor application performance
2. Set up monitoring and alerts
3. Configure custom domain
4. Scale resources as needed

## Support
- Check DigitalOcean App logs
- Review Stripe webhook logs
- Monitor API usage in DeepSeek dashboard