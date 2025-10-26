class PricingService {
  constructor() {
    // Pricing tiers (in USD)
    this.pricingTiers = {
      free: {
        name: 'Free',
        monthlyCost: 0,
        monthlyTokens: 10000, // 10K tokens per month
        features: ['Basic AI Chat', 'Standard Models']
      },
      pro: {
        name: 'Pro',
        monthlyCost: 9.99,
        monthlyTokens: 100000, // 100K tokens per month
        features: ['All AI Models', 'Priority Access', 'Advanced Features']
      },
      enterprise: {
        name: 'Enterprise',
        monthlyCost: 49.99,
        monthlyTokens: 1000000, // 1M tokens per month
        features: ['Custom Models', 'API Access', 'Dedicated Support']
      }
    };

    // Cost per token (in USD)
    this.costPerToken = {
      input: 0.000001,  // $0.001 per 1K tokens
      output: 0.000002  // $0.002 per 1K tokens
    };

    // Profit margin (30%)
    this.profitMargin = 0.3;
  }

  /**
   * Calculate cost for token usage
   * @param {Object} usage - Token usage object
   * @returns {number} - Cost in USD
   */
  calculateCost(usage) {
    const inputCost = (usage.prompt_tokens || 0) * this.costPerToken.input;
    const outputCost = (usage.completion_tokens || 0) * this.costPerToken.output;
    
    return inputCost + outputCost;
  }

  /**
   * Calculate price to charge customer
   * @param {Object} usage - Token usage object
   * @param {string} tier - Pricing tier
   * @returns {number} - Price to charge in USD
   */
  calculatePrice(usage, tier = 'free') {
    const cost = this.calculateCost(usage);
    
    // For free tier, charge nothing (but track usage)
    if (tier === 'free') {
      return 0;
    }

    // Add profit margin
    const price = cost * (1 + this.profitMargin);
    
    // Minimum charge of $0.01
    return Math.max(price, 0.01);
  }

  /**
   * Check if user has exceeded their monthly token limit
   * @param {number} monthlyUsage - Total tokens used this month
   * @param {string} tier - Pricing tier
   * @returns {Object} - Status object
   */
  checkUsageLimit(monthlyUsage, tier = 'free') {
    const tierLimit = this.pricingTiers[tier]?.monthlyTokens || 0;
    const remaining = Math.max(0, tierLimit - monthlyUsage);
    const exceeded = monthlyUsage > tierLimit;

    return {
      tier,
      monthlyUsage,
      tierLimit,
      remaining,
      exceeded,
      canUse: !exceeded
    };
  }

  /**
   * Get pricing tiers
   * @returns {Object} - Pricing tiers
   */
  getPricingTiers() {
    return this.pricingTiers;
  }

  /**
   * Calculate profit for a transaction
   * @param {Object} usage - Token usage object
   * @param {string} tier - Pricing tier
   * @returns {number} - Profit in USD
   */
  calculateProfit(usage, tier = 'free') {
    const cost = this.calculateCost(usage);
    const price = this.calculatePrice(usage, tier);
    
    return price - cost;
  }

  /**
   * Get usage statistics
   * @param {Array} transactions - Array of transaction objects
   * @returns {Object} - Usage statistics
   */
  getUsageStats(transactions) {
    const totalTokens = transactions.reduce((sum, t) => sum + (t.prompt_tokens + t.completion_tokens), 0);
    const totalCost = transactions.reduce((sum, t) => sum + t.cost, 0);
    const totalRevenue = transactions.reduce((sum, t) => sum + t.price, 0);
    const totalProfit = totalRevenue - totalCost;

    return {
      totalTransactions: transactions.length,
      totalTokens,
      totalCost,
      totalRevenue,
      totalProfit,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    };
  }
}

module.exports = PricingService;