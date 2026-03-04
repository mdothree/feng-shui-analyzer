import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Feng Shui Analyzer',
  description: 'Room/address energy flow analyzer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
