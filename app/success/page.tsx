'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fengshui-api-eosin.vercel.app';

// Same localStorage contract as shared/ui-components/entitlement.js so the
// vanilla and Next.js services stay interchangeable.
function grantEntitlement(readingType: string, sessionId: string) {
  try {
    const key = 'mdo3d_premium';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    if (list.some((e: any) => e.sessionId === sessionId)) return;
    list.push({ readingType, sessionId, verifiedAt: Date.now(), consumed: false });
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

export default function Success() {
  const [state, setState] = useState<'verifying' | 'confirmed' | 'failed'>('verifying');

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id');
    if (!sessionId) { setState('failed'); return; }
    fetch(`${API_URL}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.paid) {
          // The fengshui API stores the tier as metadata.analysisType
          // (single-room | full-home | office); readingType is the
          // key other divination APIs use, kept as a fallback.
          grantEntitlement(data.metadata?.analysisType || data.metadata?.readingType || 'premium', sessionId);
          setState('confirmed');
        } else {
          setState('failed');
        }
      })
      .catch(() => setState('failed'));
  }, []);

  return (
    <main id="main-content" className="status-page">
      {state === 'verifying' && (
        <>
          <h1>Confirming your payment…</h1>
          <p>One moment while we verify with Stripe.</p>
        </>
      )}
      {state === 'confirmed' && (
        <>
          <h1 className="status-ok">Payment confirmed</h1>
          <p>Your premium Feng Shui analysis is unlocked. Run your analysis and the premium version will be applied automatically.</p>
        </>
      )}
      {state === 'failed' && (
        <>
          <h1 className="status-bad">We couldn&apos;t confirm this payment</h1>
          <p>If you were charged, your payment is safe — reply to your Stripe receipt email and we&apos;ll make it right.</p>
        </>
      )}
      <a href="/" className="home-link">
        Return Home
      </a>
    </main>
  );
}
