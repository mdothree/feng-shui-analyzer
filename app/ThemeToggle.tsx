'use client';

import { useEffect } from 'react';

// Light/dark toggle — MDOThree template method (shared/mdothree/site-chrome.js, theme section).
// public/js/theme-init.js sets <html data-theme> before first paint (saved choice > OS preference);
// this button flips it, persists the choice (localStorage "mdo-theme", try/catch) and, while no
// choice is saved, keeps following the OS setting live.
const KEY = 'mdo-theme';

function current(): 'light' | 'dark' {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}
function label(btn: Element) {
  const next = current() === 'dark' ? 'light' : 'dark';
  const text = 'Switch to ' + next + ' theme';
  btn.setAttribute('aria-label', text);
  btn.setAttribute('title', text);
  btn.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false');
}
function apply(theme: 'light' | 'dark', persist: boolean) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  if (persist) {
    root.removeAttribute('data-theme-source');
    try { window.localStorage.setItem(KEY, theme); } catch (e) { /* storage blocked: choice lasts this page */ }
  }
  document.querySelectorAll('[data-mdo-theme]').forEach(label);
  try { document.dispatchEvent(new CustomEvent('mdo-theme-change', { detail: { theme } })); } catch (e) {}
}

export default function ThemeToggle() {
  useEffect(() => {
    document.querySelectorAll('[data-mdo-theme]').forEach(label);
    let mq: MediaQueryList | null = null;
    const onOs = (e: MediaQueryListEvent) => {
      if (document.documentElement.getAttribute('data-theme-source') === 'os') apply(e.matches ? 'dark' : 'light', false);
    };
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', onOs); else if (mq.addListener) mq.addListener(onOs);
    } catch (e) { mq = null; }
    return () => {
      if (!mq) return;
      if (mq.removeEventListener) mq.removeEventListener('change', onOs); else if (mq.removeListener) mq.removeListener(onOs);
    };
  }, []);

  return (
    <button
      type="button"
      className="mdo-theme"
      data-mdo-theme=""
      aria-label="Switch theme"
      title="Switch theme"
      onClick={() => apply(current() === 'dark' ? 'light' : 'dark', true)}
    >
      <svg className="mdo-i mdo-i-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      <svg className="mdo-i mdo-i-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    </button>
  );
}
