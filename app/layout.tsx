import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feng Shui Analyzer',
  description: 'Analyze your space energy with ancient Feng Shui wisdom. Get personalized recommendations to harmonize your home or office.',
  openGraph: {
    title: 'Feng Shui Analyzer',
    description: 'Harmonize your space with ancient wisdom',
    url: 'https://fengshui.mdo3d.com',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☯️</text></svg>" />
      </head>
      <body style={{ margin: 0, background: '#0f0f1a', color: '#f1f5f9' }}>{children}</body>
    </html>
  )
}
