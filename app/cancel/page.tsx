export default function Cancel() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', textAlign: 'center' }}>
      <h1 style={{ color: '#ef4444' }}>Payment Cancelled</h1>
      <p>Your payment was cancelled.</p>
      <a 
        href="/" 
        style={{ 
          display: 'inline-block', 
          marginTop: '2rem', 
          color: '#635bff' 
        }}
      >
        Try Again
      </a>
    </main>
  );
}
