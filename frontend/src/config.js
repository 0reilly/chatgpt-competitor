// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key';
export const STRIPE_PRO_PRICE_ID = import.meta.env.VITE_STRIPE_PRO_PRICE_ID || 'price_test_pro';
export const STRIPE_ENTERPRISE_PRICE_ID = import.meta.env.VITE_STRIPE_ENTERPRISE_PRICE_ID || 'price_test_enterprise';

// Environment
export const IS_PRODUCTION = import.meta.env.NODE_ENV === 'production';