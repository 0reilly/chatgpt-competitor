#!/bin/bash

# ChatGPT Competitor Deployment Script
# Deploys to DigitalOcean App Platform

echo "🚀 Deploying ChatGPT Competitor to DigitalOcean..."

# Check if app.yaml exists
if [ ! -f "app.yaml" ]; then
    echo "❌ app.yaml not found. Please ensure you're in the project root."
    exit 1
fi

# Validate doctl authentication
echo "🔐 Validating DigitalOcean authentication..."
doctl auth list
if [ $? -ne 0 ]; then
    echo "❌ DigitalOcean authentication failed. Please check your API token."
    exit 1
fi

echo "✅ Authentication successful"

# Create the app
echo "📦 Creating DigitalOcean App..."
doctl apps create --spec app.yaml

if [ $? -eq 0 ]; then
    echo "✅ App creation initiated!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Check deployment status: doctl apps list"
    echo "2. View logs: doctl apps logs <app-id>"
    echo "3. Set environment variables in DigitalOcean dashboard"
    echo "4. Configure custom domain if needed"
    echo ""
    echo "🌐 Your app will be available at: https://chatgpt-competitor-xxxxx.ondigitalocean.app"
else
    echo "❌ App creation failed. Check the error above."
    exit 1
fi