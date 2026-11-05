import React from 'react'
import { Helmet } from 'react-helmet-async'
import { SITE_CONFIG } from '@/utils'

export interface SeoProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'profile' | 'article'
  schema?: Record<string, unknown> | Array<Record<string, unknown>>
  noindex?: boolean
}

export const Seo: React.FC<SeoProps> = ({
  title,
  description = SITE_CONFIG.description,
  image = `${SITE_CONFIG.url}/images/profile.webp`,
  url = SITE_CONFIG.url,
  type = 'website',
  schema,
  noindex = false,
}) => {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} | Full-Stack Developer (MERN Stack)`

  // Resolve absolute URL for canonical and image
  const canonicalUrl = url.startsWith('http')
    ? url
    : `${SITE_CONFIG.url}${url.startsWith('/') ? url : `/${url}`}`

  const absoluteImageUrl = image.startsWith('http')
    ? image
    : `${SITE_CONFIG.url}${image.startsWith('.') ? image.slice(1) : image.startsWith('/') ? image : `/${image}`}`

  // Default Person & WebSite Schema
  const defaultPersonSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Santosh (Rustam) Shrestha',
    alternateName: ['Rustam Shrestha', 'Santosh Shrestha'],
    jobTitle: 'Full-Stack Developer (MERN Stack)',
    url: 'https://santoshshrestha4.com.np',
    image: `${SITE_CONFIG.url}/images/profile.webp`,
    sameAs: [
      'https://github.com/Rustam-Shrestha',
      'https://www.linkedin.com/in/santoshshrestha4',
      'https://x.com/44rustam',
      'https://linktr.ee/santoshshrestha',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Saraswati Multiple Campus, Tribhuvan University',
    },
    knowsAbout: [
      'React.js',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'MongoDB',
      'TypeScript',
      'Applied Machine Learning',
      'PyTorch',
    ],
  }

  const combinedSchema = schema
    ? Array.isArray(schema)
      ? [defaultPersonSchema, ...schema]
      : [defaultPersonSchema, schema]
    : defaultPersonSchema

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:alt" content={SITE_CONFIG.name} />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@44rustam" />
      <meta name="twitter:creator" content="@44rustam" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(combinedSchema)}
      </script>
    </Helmet>
  )
}

export default Seo
