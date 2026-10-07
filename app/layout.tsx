import type { Metadata, Viewport } from 'next'
import { SITE_URL, SITE_NAME, JSON_LD, pageMetadata } from './lib/seo'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body style={{ margin: 0, background: '#0f0f1a', color: '#f1f5f9' }}>{children}</body>
    </html>
  )
}
