import type { Metadata, Viewport } from 'next'
import { SITE_URL, SITE_NAME, JSON_LD, pageMetadata } from './lib/seo'
import ThemeToggle from './ThemeToggle'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  keywords: ["feng shui", "feng shui analyzer", "home feng shui", "five elements", "bagua", "energy flow", "room layout"],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  ...pageMetadata({
    title: "Feng Shui Room Guidance — Feng Shui Analyzer",
    description: "Choose your space, room type and facing direction to get Feng Shui guidance on energy flow, the five elements and practical changes for your home or office.",
    path: '/',
  }),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: "#10b981",
}

const SKIP_LINK_CSS =
  '.skip-link{position:absolute;left:-9999px;top:8px;z-index:10000;padding:8px 16px;background:#111111;color:#ffffff;font-weight:600;text-decoration:none;border-radius:4px}.skip-link:focus{left:8px;top:8px}button,input,select,textarea{font-family:inherit}'

// Light/dark tokens (MDOThree method: html[data-theme] set by /js/theme-init.js before paint). AA in both themes.
const THEME_CSS =
  ':root,html[data-theme="dark"]{--bg:#0f0f1a;--surface:#1a1a2e;--field:#252542;--field-border:transparent;--text:#f1f5f9;--muted:#94a3b8;--line:#252542;--chip-border:#374151;--accent:#10b981;--quote:#a7f3d0;--err-bg:#7f1d1d;--err-fg:#fecaca;--ok:#22c55e;--bad:#ef4444;--scheme:dark;--tg-border:#334155;--tg-hover:#1e293b}html[data-theme="light"]{--bg:#f6f4fb;--surface:#ffffff;--field:#f1eef8;--field-border:#8b84a8;--text:#1e1b2e;--muted:#4b5563;--line:#e2ddef;--chip-border:#8b84a8;--accent:#047857;--quote:#065f46;--err-bg:#fee2e2;--err-fg:#991b1b;--ok:#15803d;--bad:#b91c1c;--scheme:light;--tg-border:#cbd5e1;--tg-hover:#f1f5f9}html{color-scheme:var(--scheme)}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,sans-serif}.site-nav{max-width:800px;margin:0 auto;padding:12px 1rem 0;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:12px}.site-brand{color:var(--text);font-weight:600;text-decoration:none;min-height:44px;display:inline-flex;align-items:center}.site-brand:hover{color:var(--accent);text-decoration:underline}.mdo-theme{display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:44px;padding:0;border:1.5px solid var(--tg-border);border-radius:10px;background:var(--surface);color:var(--text);font:inherit;cursor:pointer;transition:border-color 160ms,background 160ms}.mdo-theme:hover{border-color:var(--accent);background:var(--tg-hover)}.mdo-theme:focus-visible,.site-brand:focus-visible{outline:3px solid var(--accent);outline-offset:2px}.mdo-i{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}html[data-theme="dark"] .mdo-i-moon,html:not([data-theme="dark"]) .mdo-i-sun{display:none}.status-page{padding:2rem 1rem;text-align:center;max-width:800px;margin:0 auto;box-sizing:border-box}.status-ok{color:var(--ok)}.status-bad{color:var(--bad)}.home-link{display:inline-block;margin-top:2rem;color:var(--accent)}'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="/js/theme-init.js" />
        <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <style dangerouslySetInnerHTML={{ __html: SKIP_LINK_CSS }} />
        <script src="/js/consent.js" defer />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <nav className="site-nav" aria-label="Site">
          <a className="site-brand" href="/">Feng Shui Analyzer</a>
          <ThemeToggle />
        </nav>
        {children}
      </body>
    </html>
  )
}
