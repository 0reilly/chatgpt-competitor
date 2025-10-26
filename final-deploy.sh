#!/bin/bash

# Final Deployment Script for ChatGPT Competitor
# This script guides through the final deployment steps

echo "=== ChatGPT Competitor Final Deployment ==="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from project root."
    exit 1
fi

echo "✅ Project structure verified"
echo ""

# Step 1: Manual DigitalOcean Deployment
echo "Step 1: Manual DigitalOcean Deployment"
echo "======================================="
echo ""
echo "1. Go to: https://cloud.digitalocean.com/apps"
echo "2. Click 'Create App'"
echo "3. Connect GitHub account"
echo "4. Select repository: 0reilly/chatgpt-competitor"
echo "5. Select branch: main"
echo "6. Configure build settings:"
echo "   - Build Command: npm run build"
echo "   - Run Command: npm start"
echo "   - HTTP Port: 3000"
echo ""

# Step 2: Environment Variables
echo "Step 2: Set Environment Variables"
echo "=================================="
echo ""
echo "In DigitalOcean App Settings > Environment Variables, add:"
echo ""
echo "DEEPSEEK_API_KEY=your_deepseek_api_key"
echo "STRIPE_PUBLISHABLE_KEY=pk_test_your_key"
echo "STRIPE_SECRET_KEY=sk_test_your_key"
echo "STRIPE_WEBHOOK_SECRET=whsec_your_secret"
echo "NODE_ENV=production"
echo ""

# Step 3: Stripe Webhook
echo "Step 3: Configure Stripe Webhook"
echo "=================================="
echo ""
echo "1. Go to: https://dashboard.stripe.com/test/webhooks"
echo "2. Create endpoint with your app URL:"
echo "   https://your-app-name.ondigitalocean.app/api/webhook"
echo "3. Select event: checkout.session.completed"
echo "4. Copy the webhook secret"
echo ""

# Step 4: Testing
echo "Step 4: Test Deployment"
echo "========================"
echo ""
echo "1. Access your app at the DigitalOcean provided URL"
echo "2. Test chat functionality"
echo "3. Test payment flow"
echo "4. Check Stripe dashboard for webhook events"
echo ""

echo "✅ Deployment guide complete!"
echo ""
echo "Next steps:"
echo "- Monitor app performance"
echo "- Set up monitoring"
echo "- Configure custom domain"
echo "- Scale as needed"