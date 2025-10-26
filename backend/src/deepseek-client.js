const axios = require('axios');

class DeepSeekClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.deepseek.com/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Send a chat completion request to DeepSeek API
   * @param {Array} messages - Array of message objects
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - API response
   */
  async chatCompletion(messages, options = {}) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: options.model || 'deepseek-chat',
        messages: messages,
        max_tokens: options.max_tokens || 2048,
        temperature: options.temperature || 0.7,
        stream: options.stream || false
      });

      return {
        success: true,
        data: response.data,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('DeepSeek API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
        statusCode: error.response?.status
      };
    }
  }

  /**
   * Get available models from DeepSeek
   * @returns {Promise<Object>} - Available models
   */
  async getModels() {
    try {
      const response = await this.client.get('/models');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('DeepSeek Models Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  /**
   * Calculate cost based on token usage
   * @param {Object} usage - Token usage object
   * @returns {number} - Cost in USD
   */
  calculateCost(usage) {
    // DeepSeek pricing (example rates - check current pricing)
    const inputCostPerToken = 0.000001; // $0.001 per 1K tokens
    const outputCostPerToken = 0.000002; // $0.002 per 1K tokens
    
    const inputCost = (usage.prompt_tokens || 0) * inputCostPerToken;
    const outputCost = (usage.completion_tokens || 0) * outputCostPerToken;
    
    return inputCost + outputCost;
  }
}

module.exports = DeepSeekClient;