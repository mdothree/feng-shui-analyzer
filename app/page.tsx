'use client';

import { useEffect, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fengshui-api-eosin.vercel.app';

// Entitlements written by /success after Stripe verification — same localStorage
// contract as shared/ui-components/entitlement.js. Peek before the API call,
// consume only after a successful premium response so a failed call doesn't
// burn the credit.
const ENT_KEY = 'mdo3d_premium';
function entIndex(list: any[]): number {
  return list.findIndex((e: any) => !e.consumed &&
    (!/monthly/.test(e.readingType || '') || Date.now() - e.verifiedAt < 30 * 24 * 60 * 60 * 1000));
}
function hasEntitlement(): boolean {
  try { return entIndex(JSON.parse(localStorage.getItem(ENT_KEY) || '[]')) !== -1; }
  catch { return false; }
}
function activeSessionId(): string | null {
  try {
    const list = JSON.parse(localStorage.getItem(ENT_KEY) || '[]');
    const i = entIndex(list);
    return i === -1 ? null : (list[i].sessionId || null);
  } catch { return null; }
}
function consumeEntitlement(): void {
  try {
    const list = JSON.parse(localStorage.getItem(ENT_KEY) || '[]');
    const idx = entIndex(list);
    if (idx !== -1 && !/monthly/.test(list[idx].readingType || '')) {
      list[idx].consumed = true;
      localStorage.setItem(ENT_KEY, JSON.stringify(list));
    }
  } catch {}
}

const spaceTypes = ['Home', 'Office', 'Apartment', 'Studio', 'Commercial'];
const roomTypes = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Home Office', 'Dining Room', 'Entrance'];
const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest', 'Unknown'];
const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const commonIssues = [
  'Cluttered spaces',
  'Poor lighting',
  'Blocked pathways',
  'Sharp corners',
  'Stagnant energy',
  'Lack of plants',
  'Too much electronics',
  'Imbalanced colors'
];

export default function Home() {
  const [formData, setFormData] = useState({
    spaceType: 'Home',
    roomType: 'Living Room',
    direction: 'Unknown',
    birthYear: '',
    elements: [] as string[],
    issues: [] as string[],
    goals: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  // The form is swapped for the results; bring the results into view so the
  // user lands on the score header, not mid-page.
  useEffect(() => {
    if (analysis) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [analysis]);

  const handleElementToggle = (element: string) => {
    setFormData(prev => ({
      ...prev,
      elements: prev.elements.includes(element)
        ? prev.elements.filter(e => e !== element)
        : [...prev.elements, element]
    }));
  };

  const handleIssueToggle = (issue: string) => {
    setFormData(prev => ({
      ...prev,
      issues: prev.issues.includes(issue)
        ? prev.issues.filter(i => i !== issue)
        : [...prev.issues, issue]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const premium = hasEntitlement();
    try {
      const response = await fetch(`${API_URL}/api/analysis/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spaceData: {
            spaceType: formData.spaceType,
            roomType: formData.roomType,
            direction: formData.direction,
            birthYear: formData.birthYear || undefined,
            elements: formData.elements,
            issues: formData.issues
          },
          goals: formData.goals,
          premium,
          sessionId: premium ? activeSessionId() : undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        if (premium) consumeEntitlement();
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Failed to generate analysis');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAnalysis(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic Stripe checkout — creates a session so /success gets a session_id to verify.
  const startCheckout = async () => {
    const email = window.prompt('Enter your email to receive your premium report:');
    if (!email) return;
    try {
      const res = await fetch(`${API_URL}/api/payment/create-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisType: 'single-room', email }),
      });
      const data = await res.json();
      if (data.success && data.checkoutUrl) window.location.href = data.checkoutUrl;
      else alert('Unable to process payment. Please try again.');
    } catch {
      alert('Payment error. Please try again.');
    }
  };

  return (
    <main className="container">
      <header>
        <h1>Feng Shui Analyzer</h1>
        <p className="subtitle">Harmonize your space with ancient wisdom</p>
      </header>

      {!analysis ? (
        <form onSubmit={handleSubmit} className="analysis-form">
          <div className="form-section">
            <h3>Space Details</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fs-space-type">Space Type</label>
                <select
                  id="fs-space-type"
                  value={formData.spaceType}
                  onChange={e => setFormData(prev => ({ ...prev, spaceType: e.target.value }))}
                >
                  {spaceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fs-room-type">Room Type</label>
                <select
                  id="fs-room-type"
                  value={formData.roomType}
                  onChange={e => setFormData(prev => ({ ...prev, roomType: e.target.value }))}
                >
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fs-direction">Facing Direction</label>
                <select
                  id="fs-direction"
                  value={formData.direction}
                  onChange={e => setFormData(prev => ({ ...prev, direction: e.target.value }))}
                >
                  {directions.map(dir => (
                    <option key={dir} value={dir}>{dir}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fs-birth-year">Your Birth Year (Optional)</label>
                <input
                  id="fs-birth-year"
                  type="number"
                  placeholder="e.g., 1990"
                  value={formData.birthYear}
                  onChange={e => setFormData(prev => ({ ...prev, birthYear: e.target.value }))}
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Elements Present in Your Space</h3>
            <div className="chip-group">
              {elements.map(element => (
                <button
                  key={element}
                  type="button"
                  className={`chip ${formData.elements.includes(element) ? 'active' : ''}`}
                  aria-pressed={formData.elements.includes(element)}
                  onClick={() => handleElementToggle(element)}
                >
                  {element}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Current Issues (Select all that apply)</h3>
            <div className="chip-group">
              {commonIssues.map(issue => (
                <button
                  key={issue}
                  type="button"
                  className={`chip ${formData.issues.includes(issue) ? 'active' : ''}`}
                  aria-pressed={formData.issues.includes(issue)}
                  onClick={() => handleIssueToggle(issue)}
                >
                  {issue}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3><label htmlFor="fs-goals">Your Goals</label></h3>
            <textarea
              id="fs-goals"
              placeholder="What would you like to improve? (e.g., better sleep, more prosperity, improved relationships)"
              value={formData.goals}
              onChange={e => setFormData(prev => ({ ...prev, goals: e.target.value }))}
              rows={3}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze My Space'}
          </button>
          {loading && (
            <p className="loading-note" role="status">Reading the energy of your space…</p>
          )}
        </form>
      ) : (
        <div className="analysis-results" ref={resultsRef}>
          <div className="result-header">
            <h2>Your Feng Shui Analysis</h2>
            <span className="score">Score: {analysis.overallScore || 'N/A'}/100</span>
          </div>

          {analysis.basicTips && (
            <div className="result-section">
              <h3>Quick Tips for Your {formData.roomType}</h3>
              <ul className="tips-list">
                {analysis.basicTips.map((tip: string, i: number) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.energyAssessment && (
            <div className="result-section">
              <h3>Energy Assessment</h3>
              <p>{analysis.energyAssessment}</p>
            </div>
          )}

          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="result-section">
              <h3>Recommendations</h3>
              {analysis.recommendations.map((rec: any, i: number) => (
                <div key={i} className="recommendation-card">
                  <div className="rec-header">
                    <span className="rec-area">{rec.area}</span>
                    <span className={`rec-priority priority-${rec.priority}`}>{rec.priority}</span>
                  </div>
                  <p className="rec-issue">{rec.issue}</p>
                  <p className="rec-solution">{rec.solution}</p>
                </div>
              ))}
            </div>
          )}

          <div className="premium-cta">
            <h3>Want a Deeper Analysis?</h3>
            <p>Get a comprehensive AI-powered Feng Shui reading with personalized recommendations.</p>
            <button
              className="btn-premium"
              onClick={startCheckout}
            >
              Get Premium Analysis - $4.99
            </button>
          </div>

          <button className="btn-secondary" onClick={resetForm}>
            Analyze Another Space
          </button>
        </div>
      )}

      <footer>
        <p>Part of the <a href="https://mdo3d.com">MDO3D Divination</a> suite</p>
      </footer>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: system-ui, -apple-system, sans-serif;
          color: #f1f5f9;
          background: #0f0f1a;
          min-height: 100vh;
        }
        header { text-align: center; margin-bottom: 2rem; }
        h1 {
          font-size: 2.5rem;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .subtitle { color: #94a3b8; }
        .analysis-form {
          background: #1a1a2e;
          border-radius: 1rem;
          padding: 2rem;
        }
        .form-section {
          margin-bottom: 2rem;
        }
        .form-section h3 {
          margin-bottom: 1rem;
          color: #10b981;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #94a3b8;
          font-size: 0.9rem;
        }
        select, input, textarea {
          box-sizing: border-box;
          width: 100%;
          padding: 0.75rem;
          background: #252542;
          border: 1px solid transparent;
          border-radius: 0.5rem;
          color: #f1f5f9;
          font-size: 1rem;
          font-family: inherit;
          color-scheme: dark;
        }
        select:focus, input:focus, textarea:focus {
          outline: none;
          border-color: #10b981;
        }
        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .chip {
          padding: 0.5rem 1rem;
          background: #252542;
          border: 1px solid #374151;
          border-radius: 2rem;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s;
        }
        .chip:hover { border-color: #10b981; }
        .chip.active {
          background: #047857;
          color: white;
          border-color: #10b981;
        }
        .btn-primary {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .loading-note {
          text-align: center;
          color: #94a3b8;
          margin-top: 0.75rem;
        }
        .btn-secondary {
          width: 100%;
          padding: 1rem;
          background: #252542;
          border: none;
          border-radius: 0.5rem;
          color: #f1f5f9;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 1rem;
        }
        .error-message {
          background: #7f1d1d;
          color: #fecaca;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        .analysis-results {
          background: #1a1a2e;
          border-radius: 1rem;
          padding: 2rem;
        }
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .score {
          background: #047857;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
        }
        .result-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #252542;
        }
        .result-section h3 { color: #10b981; margin-bottom: 1rem; }
        .tips-list {
          list-style: none;
          padding: 0;
        }
        .tips-list li {
          padding: 0.75rem 0;
          border-bottom: 1px solid #252542;
        }
        .tips-list li:before {
          content: '✓ ';
          color: #10b981;
        }
        .recommendation-card {
          background: #252542;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        .rec-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .rec-area { font-weight: 600; }
        .rec-priority {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
        }
        .priority-high { background: #b91c1c; }
        .priority-medium { background: #b45309; }
        .priority-low { background: #047857; }
        .rec-issue { color: #94a3b8; font-size: 0.9rem; }
        .rec-solution { margin-top: 0.5rem; }
        .premium-cta {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
          border: 1px solid #10b981;
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          margin: 2rem 0;
        }
        .btn-premium {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          color: #1a1a2e;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }
        footer {
          text-align: center;
          padding: 2rem;
          color: #94a3b8;
        }
        footer a { color: #10b981; }
      `}</style>
    </main>
  );
}
