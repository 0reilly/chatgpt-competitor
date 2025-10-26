import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { API_BASE_URL, STRIPE_PUBLISHABLE_KEY, STRIPE_PRO_PRICE_ID, STRIPE_ENTERPRISE_PRICE_ID } from './config';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ tier, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setIsLoading(false);
        return;
      }

      // Create subscription
      const response = await fetch(`${API_BASE_URL}/stripe/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: 'demo-customer-id', // In real app, get from user session
          priceId: tier.priceId
        }),
      });

      const subscriptionData = await response.json();

      if (!response.ok) {
        throw new Error(subscriptionData.error || 'Failed to create subscription');
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(
        subscriptionData.clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        setError(confirmError.message);
      } else {
        onSuccess(tier.name);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>

      {error && <div className="payment-error">{error}</div>}

      <div className="payment-actions">
        <button
          type="button"
          onClick={onCancel}
          className="cancel-btn"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="pay-btn"
        >
          {isLoading ? 'Processing...' : `Pay $${tier.monthlyCost}/month`}
        </button>
      </div>
    </form>
  );
};

const PaymentComponent = ({ isOpen, onClose, onUpgrade }) => {
  const [stripeConfig, setStripeConfig] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchStripeConfig();
    }
  }, [isOpen]);

  const fetchStripeConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stripe/config`);
      if (response.ok) {
        const config = await response.json();
        setStripeConfig(config);
      }
    } catch (error) {
      console.error('Failed to fetch Stripe config:', error);
    }
  };

  const pricingTiers = [
    {
      id: 'pro',
      name: 'Pro',
      monthlyCost: 9.99,
      priceId: STRIPE_PRO_PRICE_ID,
      description: '100K tokens per month, priority access, all AI models'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyCost: 49.99,
      priceId: STRIPE_ENTERPRISE_PRICE_ID,
      description: '1M tokens per month, custom models, dedicated support'
    }
  ];

  const handleSuccess = (tierName) => {
    onUpgrade(tierName.toLowerCase());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-modal-header">
          <h2>Upgrade Your Plan</h2>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>

        <div className="payment-tiers">
          {pricingTiers.map(tier => (
            <div key={tier.id} className="payment-tier">
              <div className="tier-info">
                <h3>{tier.name}</h3>
                <p className="tier-price">${tier.monthlyCost}/month</p>
                <p className="tier-description">{tier.description}</p>
              </div>
              
              {stripeConfig && (
                <Elements stripe={loadStripe(stripeConfig.publishableKey)}>
                  <CheckoutForm
                    tier={tier}
                    onSuccess={() => handleSuccess(tier.name)}
                    onCancel={onClose}
                  />
                </Elements>
              )}
            </div>
          ))}
        </div>

        <div className="payment-security">
          <p>✅ Secure payment powered by Stripe</p>
          <p>💳 Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;