#!/bin/bash

# Environment Setup Script for ChatGPT Competitor
# This script helps set up environment variables for deployment

echo "=== ChatGPT Competitor Environment Setup ==="
echo ""
echo "This script will help you gather the required environment variables."
echo ""

# DeepSeek API Key
echo "1. DeepSeek API Key:"
echo "   - Visit: https://platform.deepseek.com/api_keys"
echo "   - Create a new API key"
echo "   - Environment Variable: DEEPSEEK_API_KEY"
echo ""

# Stripe Configuration
echo "2. Stripe Configuration:"
echo "   - Visit: https://dashboard.stripe.com/test/apikeys"
echo "   - Get Publishable Key: STRIPE_PUBLISHABLE_KEY"
echo "   - Get Secret Key: STRIPE_SECRET_KEY"
echo ""

# Stripe Webhook
echo "3. Stripe Webhook Setup:"
echo "   - Go to: https://dashboard.stripe.com/test/webhooks"
echo "   - Create endpoint: https://your-app.ondigitalocean.app/api/webhook"
echo "   - Select event: checkout.session.completed"
echo "   - Get Webhook Secret: STRIPE_WEBHOOK_SECRET"
echo ""

echo "=== DigitalOcean App Setup ==="
echo ""
echo "After gathering all keys:"
echo "1. Go to your DigitalOcean App"
echo "2. Navigate to Settings > Environment Variables"
echo "3. Add each key as shown above"
echo "4. Save and redeploy if needed"
echo ""

echo "Required Environment Variables:"
echo "DEEPSEEK_API_KEY=your_deepseek_key_here"
echo "STRIPE_PUBLISHABLE_KEY=pk_test_..."
echo "STRIPE_SECRET_KEY=sk_test_..."
echo "STRIPE_WEBHOOK_SECRET=whsec_..."
echo "NODE_ENV=production"