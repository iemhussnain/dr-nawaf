import Head from 'next/head'

/**
 * SEO Head component for meta tags
 * @param {Object} props - SEO properties
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - SEO keywords (comma-separated)
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogType - Open Graph type (website, article, etc.)
 * @param {string} props.canonical - Canonical URL
 * @param {Object} props.jsonLd - JSON-LD structured data
 */
export function SEOHead({
  title = 'Dr. Nawaf Medical Center',
  description = 'Professional medical services and healthcare solutions',
  keywords = 'medical center, healthcare, doctor, appointments, medical services',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  canonical,
  jsonLd,
}) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dr-nawaf.com'
  const fullTitle = title.includes('Dr. Nawaf') ? title : `${title} | Dr. Nawaf Medical Center`
  const canonicalUrl = canonical || siteUrl

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Dr. Nawaf Medical Center" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Dr. Nawaf Medical Center" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  )
}

/**
 * Generate JSON-LD for Medical Business
 */
export const generateMedicalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'Dr. Nawaf Medical Center',
  description: 'Professional medical services and healthcare solutions',
  url: process.env.NEXT_PUBLIC_APP_URL,
  telephone: '+966-XXX-XXXXXXX',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Your Street Address',
    addressLocality: 'Your City',
    addressRegion: 'Your Region',
    postalCode: 'Your Postal Code',
    addressCountry: 'SA',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '14:00',
    },
  ],
})

/**
 * Generate JSON-LD for Article
 */
export const generateArticleSchema = (article) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.featuredImage,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  author: {
    '@type': 'Person',
    name: `Dr. ${article.author?.firstName} ${article.author?.lastName}`,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Dr. Nawaf Medical Center',
    logo: {
      '@type': 'ImageObject',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    },
  },
})

/**
 * Generate JSON-LD for Product
 */
export const generateProductSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images,
  sku: product.sku,
  offers: {
    '@type': 'Offer',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/${product.slug}`,
    priceCurrency: 'SAR',
    price: product.price,
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
  },
})

export default SEOHead
