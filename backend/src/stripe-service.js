const Stripe = require('stripe');

class StripeService {
  constructor(secretKey, publishableKey) {
    this.stripe = Stripe(secretKey);
    this.publishableKey = publishableKey;
  }

  /**
   * Create a Stripe customer
   * @param {Object} customerData - Customer information
   * @returns {Promise<Object>} - Stripe customer object
   */
  async createCustomer(customerData) {
    try {
      const customer = await this.stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        metadata: {
          userId: customerData.userId
        }
      });

      return {
        success: true,
        customer
      };
    } catch (error) {
      console.error('Stripe customer creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a subscription for a customer
   * @param {string} customerId - Stripe customer ID
   * @param {string} priceId - Stripe price ID
   * @returns {Promise<Object>} - Subscription object
   */
  async createSubscription(customerId, priceId) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return {
        success: true,
        subscription,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      };
    } catch (error) {
      console.error('Stripe subscription creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a checkout session for one-time payment
   * @param {Object} sessionData - Session configuration
   * @returns {Promise<Object>} - Checkout session
   */
  async createCheckoutSession(sessionData) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        customer: sessionData.customerId,
        line_items: [
          {
            price: sessionData.priceId,
            quantity: 1,
          },
        ],
        mode: sessionData.mode || 'subscription',
        success_url: sessionData.successUrl,
        cancel_url: sessionData.cancelUrl,
        metadata: {
          userId: sessionData.userId,
          tokens: sessionData.tokens
        },
      });

      return {
        success: true,
        session
      };
    } catch (error) {
      console.error('Stripe checkout session error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a payment intent for usage-based billing
   * @param {Object} paymentData - Payment information
   * @returns {Promise<Object>} - Payment intent
   */
  async createPaymentIntent(paymentData) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: paymentData.amount, // in cents
        currency: 'usd',
        customer: paymentData.customerId,
        metadata: {
          userId: paymentData.userId,
          tokens: paymentData.tokens,
          description: `AI Chat Usage - ${paymentData.tokens} tokens`
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Stripe payment intent error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get Stripe products and prices
   * @returns {Promise<Object>} - Products and prices
   */
  async getProducts() {
    try {
      const products = await this.stripe.products.list({
        active: true,
        expand: ['data.default_price']
      });

      return {
        success: true,
        products: products.data
      };
    } catch (error) {
      console.error('Stripe products retrieval error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Handle Stripe webhook events
   * @param {string} payload - Raw webhook payload
   * @param {string} signature - Stripe signature
   * @param {string} webhookSecret - Webhook secret
   * @returns {Promise<Object>} - Webhook event
   */
  async handleWebhook(payload, signature, webhookSecret) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      
      return {
        success: true,
        event
      };
    } catch (error) {
      console.error('Stripe webhook error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get publishable key
   * @returns {string} - Publishable key
   */
  getPublishableKey() {
    return this.publishableKey;
  }
}

module.exports = StripeService;