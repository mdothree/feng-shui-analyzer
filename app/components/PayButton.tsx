'use client';

interface PayButtonProps {
  paymentLink?: string;
  priceId?: string;
  label?: string;
}

export default function PayButton({
  paymentLink = 'https://buy.stripe.com/eVq8wO8ta9eh5yc6ZR8k800',
  priceId,
  label = 'Get Premium - $4.99'
}: PayButtonProps) {
  const handleClick = () => {
    window.location.href = paymentLink;
  };

  return (
    <button
      onClick={handleClick}
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