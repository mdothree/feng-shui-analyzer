import type { Metadata } from 'next'
import { pageMetadata } from '../lib/seo'

export const metadata: Metadata = pageMetadata({
  title: "Payment Confirmed — Feng Shui Analyzer",
  description: "Thank you. Your Feng Shui Analyzer payment is being confirmed. Once verified, your premium reading is unlocked on this device. Return to the app to continue.",
  path: "/success",
  noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
