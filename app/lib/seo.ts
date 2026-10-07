import type { Metadata } from 'next'

export const SITE_URL = "https://fengshui.mdo3d.com"
export const SITE_NAME = "Feng Shui Analyzer"
const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: "Feng Shui Analyzer — Harmonize the energy of your space. Part of MDO3D Guidance.",
}

// Shared SEO defaults; pages override title/description/canonical via their own metadata.
export function pageMetadata(opts: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  const url = `${SITE_URL}${opts.path}`
  return {
    title: { absolute: opts.title },
    description: opts.description,
    alternates: { canonical: url },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'website',
      siteName: "Feng Shui Analyzer · MDO3D Guidance",
      title: opts.title,
      description: opts.description,
      url,
      images: [OG_IMAGE],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
  }
}

export const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://fengshui.mdo3d.com/#website",
      "url": "https://fengshui.mdo3d.com/",
      "name": "Feng Shui Analyzer",
      "description": "Choose your space, room type and facing direction to get Feng Shui guidance on energy flow, the five elements and practical changes for your home or office.",
      "inLanguage": "en",
      "publisher": {
        "@type": "Organization",
        "name": "MDO3D"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://fengshui.mdo3d.com/#app",
      "name": "Feng Shui Analyzer",
      "url": "https://fengshui.mdo3d.com/",
      "description": "Choose your space, room type and facing direction to get Feng Shui guidance on energy flow, the five elements and practical changes for your home or office.",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Any (web browser)",
      "image": "https://fengshui.mdo3d.com/og-image.png",
      "isPartOf": {
        "@id": "https://fengshui.mdo3d.com/#website"
      }
    }
  ]
}
