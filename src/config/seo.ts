import { APP_NAME, APP_DESCRIPTION, APP_URL } from './constants'

export function buildMetadata({
  title,
  description,
  path = '',
  image,
}: {
  title?: string
  description?: string
  path?: string
  image?: string
}) {
  const fullTitle = title ? `${title} | ${APP_NAME}` : `${APP_NAME} — ${APP_DESCRIPTION}`
  const desc = description ?? APP_DESCRIPTION
  const url = `${APP_URL}${path}`
  const ogImage = image ?? `${APP_URL}/og-image.png`

  return {
    // Use 'absolute' so the root layout's title template doesn't append APP_NAME twice
    title: { absolute: fullTitle },
    description: desc,
    metadataBase: new URL(APP_URL),
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: APP_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
