import PayButton from './components/PayButton';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Feng Shui Analyzer</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>
        Discover the energy flow of your space
      </p>

      <section style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h2>Free Preview</h2>
        <p>Enter your address for a basic energy assessment:</p>
        <input 
          type="text" 
          placeholder="Enter address..." 
          style={{ 
            padding: '10px', 
            width: '100%', 
            maxWidth: '400px',
            marginTop: '0.5rem' 
          }}
        />
        <button style={{
          display: 'block',
          marginTop: '1rem',
          padding: '10px 20px',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Get Free Preview
        </button>
      </section>

      <section style={{ marginTop: '2rem', padding: '1.5rem', border: '2px solid #635bff', borderRadius: '8px' }}>
        <h2>Full Feng Shui Reading</h2>
        <ul>
          <li>Complete energy flow analysis</li>
          <li>Personalized remedies</li>
          <li>Optimal furniture placement</li>
          <li>Color recommendations</li>
          <li>PDF report delivered to your email</li>
        </ul>
        <PayButton 
          paymentLink="https://buy.stripe.com/eVq8wO8ta9eh5yc6ZR8k800"
          priceId="price_fengshui_full" 
          label="Get Full Reading - $4.99"
        />
      </section>

      <p style={{ color: '#666', marginTop: '3rem', fontSize: '0.9rem' }}>
        Deployed via Project HACK
      </p>
    </main>
  );
}
