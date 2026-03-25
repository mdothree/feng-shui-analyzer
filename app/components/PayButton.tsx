'use client';

import { stripePromise } from '../lib/stripe';

interface PayButtonProps {
  priceId?: string;
  label?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export default function PayButton({
  priceId = 'price_fengshui_basic',
  label = 'Get Full Reading - $9.99',
  successUrl = typeof window !== 'undefined' ? `${window.location.origin}/success` : '',
  cancelUrl = typeof window !== 'undefined' ? `${window.location.origin}/cancel` : ''
}: PayButtonProps) {
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    if (!stripe) {
      console.error('Stripe failed to load');
      return;
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      successUrl,
      cancelUrl,
    });

    if (error) {
      console.error('Stripe error:', error);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      style={{
        backgroundColor: '#635bff',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '1rem'
      }}
    >
      {label}
    </button>
  );
}
