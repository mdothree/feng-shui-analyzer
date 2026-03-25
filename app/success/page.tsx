export default function Success() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', textAlign: 'center' }}>
      <h1 style={{ color: '#22c55e' }}>Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
      <p>Check your email for the full Feng Shui reading.</p>
      <a 
        href="/" 
        style={{ 
          display: 'inline-block', 
          marginTop: '2rem', 
          color: '#635bff' 
        }}
      >
        Return Home
      </a>
    </main>
  );
}
