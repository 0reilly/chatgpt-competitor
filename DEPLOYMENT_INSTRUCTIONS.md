# DigitalOcean Deployment Instructions

## Manual Deployment Steps

Since automatic deployment requires GitHub integration, follow these steps to deploy manually:

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository named `chatgpt-competitor`
2. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/chatgpt-competitor.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create DigitalOcean App

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Choose "GitHub" as source
4. Authorize DigitalOcean to access your GitHub account
5. Select your repository: `your-username/chatgpt-competitor`
6. Select branch: `main`

### Step 3: Configure App

DigitalOcean will automatically detect the app structure. It should create:
- **Backend Service** (from `/backend` directory)
- **Frontend Service** (from `/frontend` directory)

### Step 4: Set Environment Variables

In the DigitalOcean dashboard, set these environment variables:

#### Backend Environment Variables:
```
NODE_ENV=production
PORT=8080
DEEPSEEK_API_KEY=your_deepseek_api_key_here
JWT_SECRET=your_secure_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_PRO_PRICE_ID=your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=your_enterprise_price_id
STRIPE_TOKEN_PACK_PRICE_ID=your_token_pack_price_id
```

#### Frontend Environment Variables:
```
VITE_API_URL=https://your-app-domain.ondigitalocean.app/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_PRO_PRICE_ID=your_pro_price_id
VITE_STRIPE_ENTERPRISE_PRICE_ID=your_enterprise_price_id
```

### Step 5: Deploy

1. Click "Deploy" in the DigitalOcean dashboard
2. Wait for deployment to complete
3. Your app will be available at: `https://your-app-name.ondigitalocean.app`

## Alternative: Direct Upload

If you prefer not to use GitHub:

1. Create a new app in DigitalOcean App Platform
2. Choose "Upload Source Code"
3. Upload the `deployment-package.zip` file
4. Configure services manually:
   - Backend: `/backend` directory, run command: `npm start`
   - Frontend: `/frontend` directory, run command: `npm run build && npx serve -s dist -l 3000`

## Post-Deployment Setup

### 1. Verify Deployment
- Visit your app URL
- Test the chat functionality
- Test the payment integration (use Stripe test cards)

### 2. Set Up Custom Domain (Optional)
1. Go to your app settings
2. Add your custom domain
3. Configure DNS records as instructed

### 3. Set Up Monitoring
1. Enable DigitalOcean monitoring
2. Set up alerts for errors and performance issues
3. Monitor API usage and costs

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check that all dependencies are in package.json
   - Verify Node.js version compatibility

2. **API Connection Issues**
   - Verify environment variables are set correctly
   - Check CORS configuration

3. **Payment Integration Issues**
   - Verify Stripe API keys
   - Test with Stripe test cards
   - Check webhook configuration

## Production Checklist

- [ ] All environment variables set
- [ ] Stripe products configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] Performance testing completed

## Support

For deployment issues:
1. Check DigitalOcean App Platform documentation
2. Review deployment logs in the dashboard
3. Contact DigitalOcean support if needed

---

**Your ChatGPT competitor is now ready for production deployment!**