# ChatGPT Competitor

A profitable AI chat application built with DeepSeek API, featuring a modern web interface, usage-based pricing, and real-time chat functionality.

## 🚀 Features

- **Real-time AI Chat**: Powered by DeepSeek's advanced language models
- **Usage-Based Pricing**: Free tier with limits, paid tiers for heavy usage
- **Modern Web Interface**: Beautiful, responsive React frontend
- **Profit Tracking**: Real-time cost and profit calculations
- **Usage Monitoring**: Track token usage and enforce limits
- **Multiple AI Models**: Support for different DeepSeek models
- **💳 Payment Integration**: Complete Stripe payment processing

## 💰 Pricing Model

| Plan | Monthly Cost | Tokens | Features |
|------|--------------|--------|----------|
| Free | $0 | 10K | Basic AI Chat, Standard Models |
| Pro | $9.99 | 100K | All AI Models, Priority Access, Advanced Features |
| Enterprise | $49.99 | 1M | Custom Models, API Access, Dedicated Support |

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **DeepSeek API** integration
- **Stripe Payment Processing** with webhook support
- **JWT Authentication** (ready for implementation)
- **Rate Limiting** and security middleware
- **Pricing & Billing** system

### Frontend
- **React 18** with modern hooks
- **Stripe Elements** for secure payment processing
- **Vite** for fast development
- **CSS3** with gradients and animations
- **Responsive Design** for all devices

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- DeepSeek API key
- Stripe account (for payment processing)

### Quick Start

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd chatgpt-competitor
   ```

2. **Configure API keys**:
   ```bash
   # Copy the example environment file
   cp backend/.env.example backend/.env
   
   # Edit backend/.env and add your keys:
   # DEEPSEEK_API_KEY=your_actual_api_key_here
   # STRIPE_SECRET_KEY=your_stripe_secret_key
   # STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

3. **Set up Stripe products**:
   ```bash
   # Run the Stripe setup script
   cd backend
   node src/setup-stripe-products.js
   ```

4. **Start the application**:
   ```bash
   ./start.sh
   ```

   Or manually:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm install
   npm run dev

   # Terminal 2 - Frontend  
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 💳 Payment Integration

The application includes complete Stripe payment processing with:

### Features
- **Secure Payment Processing**: Stripe Elements for PCI compliance
- **Subscription Management**: Monthly recurring billing
- **Usage-Based Billing**: Pay-per-use for additional tokens
- **Webhook Support**: Handle payment events in real-time
- **Customer Management**: Stripe customer profiles

### API Endpoints
- `GET /api/stripe/config` - Get Stripe configuration
- `POST /api/stripe/create-customer` - Create Stripe customer
- `POST /api/stripe/create-subscription` - Create subscription
- `POST /api/stripe/create-checkout-session` - Create checkout session
- `POST /api/stripe/create-payment-intent` - Create payment intent
- `GET /api/stripe/products` - Get available products
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Setup Guide
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed Stripe setup instructions.

## 📊 Profit Model

The pricing service automatically calculates:
- **API costs** based on DeepSeek pricing
- **Profit margins** (30% by default)
- **Tracks usage** and enforces limits
- **Provides analytics** on revenue and profit

### Example Profit Calculation
- **Input tokens**: 1,000 ($0.001)
- **Output tokens**: 500 ($0.001)
- **Total cost**: $0.002
- **Price charged**: $0.0026 (30% margin)
- **Profit**: $0.0006

## 🔒 Security Features

- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- Input validation
- Error handling middleware
- Stripe PCI-compliant payment processing

## 🚀 Deployment

### Environment Variables

```bash
# Backend (.env)
DEEPSEEK_API_KEY=your_deepseek_api_key
PORT=3001
NODE_ENV=production
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id
STRIPE_TOKEN_PACK_PRICE_ID=price_your_token_pack_price_id
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start production backend
cd ../backend
npm start
```

## 📈 Future Enhancements

- [ ] User authentication and registration
- [ ] Database persistence (PostgreSQL)
- [ ] Real-time chat with WebSockets
- [ ] Admin dashboard for analytics
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Advanced analytics and reporting

## 📝 Testing

Run the test suite:

```bash
cd backend
npm test

# Test payment integration
node test-payment-flow.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

- **API Costs**: Monitor your DeepSeek API usage to avoid unexpected charges
- **Rate Limits**: Be aware of DeepSeek API rate limits
- **Security**: Never commit API keys or secrets to version control
- **Testing**: Test thoroughly before deploying to production
- **Payment Processing**: Ensure PCI compliance when handling payments

## 🆘 Support

For issues and questions:
1. Check the [API Documentation](https://platform.deepseek.com/api-docs/)
2. Review the [Deployment Guide](DEPLOYMENT_GUIDE.md)
3. Create an issue in the repository

---

**Built with ❤️ using DeepSeek AI**