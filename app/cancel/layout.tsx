import type { Metadata } from 'next'
import { pageMetadata } from '../lib/seo'

export const metadata: Metadata = pageMetadata({
  title: "Payment Cancelled — Feng Shui Analyzer",
  description: "Your Feng Shui Analyzer checkout was cancelled and no payment was taken. Return to the app to keep using the free features, or upgrade again whenever you like.",
  path: "/cancel",
  noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
