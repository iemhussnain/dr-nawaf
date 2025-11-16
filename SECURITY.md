# Security & Optimization Guide

This document outlines the security measures and optimizations implemented in the Dr. Nawaf Medical Center application.

## Table of Contents

1. [Security Features](#security-features)
2. [Rate Limiting](#rate-limiting)
3. [Input Sanitization](#input-sanitization)
4. [CORS Configuration](#cors-configuration)
5. [Security Headers](#security-headers)
6. [Performance Optimizations](#performance-optimizations)
7. [Best Practices](#best-practices)
8. [Security Checklist](#security-checklist)

## Security Features

### 1. Global Error Handling

- Custom error classes for different HTTP status codes
- Unified error handling across all API routes
- User-friendly error messages (no stack traces in production)
- Environment-aware logging (detailed in dev, minimal in production)
- MongoDB error formatting and sanitization

**Files:**
- `src/lib/errors/APIError.js` - Custom error classes
- `src/lib/errors/errorHandler.js` - Error handling utilities
- `src/lib/errors/logger.js` - Logging configuration

### 2. Rate Limiting

Protects against brute force attacks and API abuse using `rate-limiter-flexible`.

**Rate Limit Tiers:**

| Endpoint Type | Requests | Duration | Block Duration |
|--------------|----------|----------|----------------|
| Auth | 5 | 15 min | 15 min |
| Password Reset | 3 | 1 hour | 1 hour |
| File Upload | 10 | 1 min | 2 min |
| API Endpoints | 100 | 1 min | 1 min |
| Public Endpoints | 200 | 1 min | 30 sec |

**Usage:**

```javascript
import { withRateLimit } from '@/middleware/rateLimiter'

export const POST = withRateLimit(async (req) => {
  // Your handler code
}, 'auth') // Specify rate limit tier
```

**Files:**
- `src/middleware/rateLimiter.js` - Rate limiting middleware

### 3. Input Sanitization

Prevents XSS, NoSQL injection, and other injection attacks.

**Sanitization Functions:**

- `sanitizeString()` - Removes dangerous HTML/JS characters
- `sanitizeObject()` - Recursively sanitizes objects
- `sanitizeEmail()` - Validates and sanitizes email addresses
- `sanitizePhone()` - Sanitizes phone numbers
- `sanitizeURL()` - Validates URLs and protocols
- `sanitizeFilename()` - Prevents path traversal attacks
- `sanitizeMongoQuery()` - Prevents NoSQL injection
- `sanitizeRequestBody()` - Sanitizes entire request body

**Usage:**

```javascript
import { sanitizeRequestBody, sanitizeEmail } from '@/middleware/sanitizer'

const body = await sanitizeRequestBody(req)
const email = sanitizeEmail(body.email)
```

**Files:**
- `src/middleware/sanitizer.js` - Input sanitization utilities

### 4. CORS Configuration

Controls cross-origin resource sharing to prevent unauthorized access.

**Configuration:**

```javascript
// Default allowed origins
const origins = ['http://localhost:3000', 'http://localhost:3001']

// In production, set ALLOWED_ORIGINS environment variable
ALLOWED_ORIGINS=https://dr-nawaf.com,https://www.dr-nawaf.com
```

**Features:**
- Origin whitelisting
- Credentials support
- Preflight request handling
- Custom headers configuration

**Files:**
- `src/middleware/security.js` - CORS and security headers

### 5. Security Headers

Implements OWASP recommended security headers.

**Headers Applied:**

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| X-XSS-Protection | 1; mode=block | Enables XSS protection |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer information |
| Strict-Transport-Security | max-age=31536000 | Enforces HTTPS |
| Content-Security-Policy | (custom) | Prevents XSS attacks |

**Content Security Policy (CSP):**

```javascript
{
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  // ... more directives
}
```

### 6. CSRF Protection

Cross-Site Request Forgery protection for authenticated requests.

**Features:**
- CSRF token generation
- Token validation on state-changing requests
- Automatic token refresh
- Session-based token storage

**Usage:**

```javascript
import { validateCSRFToken, generateCSRFToken } from '@/middleware/security'

// Generate token for session
const csrfToken = generateCSRFToken()

// Validate on protected routes
const isValid = validateCSRFToken(req, session)
```

## Rate Limiting

### Implementation

Rate limiting is implemented using `rate-limiter-flexible` with in-memory storage.

### Usage Examples

**Protect Auth Endpoints:**

```javascript
import { withRateLimit } from '@/middleware/rateLimiter'

export const POST = withRateLimit(async (req) => {
  // Login logic
}, 'auth')
```

**Protect File Upload:**

```javascript
export const POST = withRateLimit(async (req) => {
  // Upload logic
}, 'upload')
```

**Custom Rate Limiting:**

```javascript
import { createRateLimiter } from '@/middleware/rateLimiter'

const customLimiter = createRateLimiter('api')
await customLimiter(req, session)
```

### Monitoring

Check rate limit status:

```javascript
import { getRateLimitInfo } from '@/middleware/rateLimiter'

const info = await getRateLimitInfo(req, session, 'api')
// Returns: { limit, remaining, reset }
```

## Input Sanitization

### XSS Prevention

All user input is sanitized to prevent XSS attacks:

```javascript
import { sanitizeString } from '@/middleware/sanitizer'

const safeTitle = sanitizeString(userInput)
// Removes: <script>, javascript:, event handlers
```

### NoSQL Injection Prevention

MongoDB queries are sanitized to prevent injection:

```javascript
import { sanitizeMongoQuery } from '@/middleware/sanitizer'

const safeQuery = sanitizeMongoQuery(userQuery)
// Blocks: $where, $function, etc.
```

### Email Validation

```javascript
import { sanitizeEmail } from '@/middleware/sanitizer'

const email = sanitizeEmail(userEmail)
// Returns: valid email or empty string
```

## CORS Configuration

### Environment Setup

```env
# Production
ALLOWED_ORIGINS=https://dr-nawaf.com,https://www.dr-nawaf.com,https://admin.dr-nawaf.com

# Development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Usage

CORS is automatically applied via middleware:

```javascript
import { withSecurity } from '@/middleware/security'

export const GET = withSecurity(async (req) => {
  // Your handler
})
```

## Security Headers

### Automatic Application

Security headers are automatically applied to all responses via middleware.

### Custom Headers

Add custom headers in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Custom-Header',
          value: 'custom-value',
        },
      ],
    },
  ]
}
```

## Performance Optimizations

### 1. Image Optimization

**Next.js Image Component:**

```javascript
import Image from 'next/image'

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false} // Use true for above-the-fold images
  quality={85} // 75-100
  placeholder="blur" // Optional
/>
```

**Configuration:**

- Automatic WebP/AVIF conversion
- Responsive image sizing
- Lazy loading by default
- CDN caching (60 seconds minimum)

**Files:**
- `next.config.js` - Image optimization configuration

### 2. Code Splitting

Automatic code splitting is enabled by Next.js:

- Route-based splitting
- Dynamic imports for heavy components
- Vendor chunk optimization

### 3. Caching Strategy

**Static Assets:**
- Cache-Control: `public, max-age=31536000, immutable`
- Applied to: `/_next/static/*`

**Images:**
- Cache-Control: `public, max-age=86400, s-maxage=86400`
- Applied to: `/images/*`

**API Routes:**
- Cache-Control: `no-store, must-revalidate`
- Applied to: `/api/*`

### 4. Compression

- Gzip/Brotli compression enabled
- Automatic in production
- Configured in `next.config.js`

### 5. SEO Optimization

**Meta Tags:**
- Title, description, keywords
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs

**Structured Data:**
- JSON-LD for rich snippets
- Medical Business schema
- Article schema
- Product schema

**Usage:**

```javascript
import { SEOHead, generateArticleSchema } from '@/components/seo/SEOHead'

<SEOHead
  title="Page Title"
  description="Page description"
  keywords="keyword1, keyword2"
  ogImage="/images/og-image.jpg"
  jsonLd={generateArticleSchema(article)}
/>
```

## Best Practices

### 1. Authentication

- ✅ Use NextAuth.js for authentication
- ✅ Implement session management
- ✅ Hash passwords with Argon2
- ✅ Use HTTP-only cookies
- ✅ Implement 2FA (recommended)

### 2. Authorization

- ✅ Check permissions on every request
- ✅ Use role-based access control (RBAC)
- ✅ Never trust client-side data
- ✅ Validate ownership before modifications

### 3. Data Validation

- ✅ Use Zod for schema validation
- ✅ Validate on both client and server
- ✅ Sanitize all user input
- ✅ Use parameterized queries

### 4. Error Handling

- ✅ Use try/catch blocks
- ✅ Log errors appropriately
- ✅ Don't expose sensitive information
- ✅ Return user-friendly messages

### 5. API Security

- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ✅ Validate Content-Type headers
- ✅ Implement CORS properly
- ✅ Use security headers

## Security Checklist

### Development

- [ ] All API routes use `asyncHandler` wrapper
- [ ] All API routes implement rate limiting
- [ ] All user input is sanitized
- [ ] All database queries use sanitized input
- [ ] All file uploads are validated
- [ ] All authentication routes use strict rate limiting
- [ ] All forms implement CSRF protection
- [ ] All passwords are hashed with Argon2
- [ ] All sensitive data is encrypted at rest

### Production

- [ ] HTTPS is enforced
- [ ] Environment variables are secure
- [ ] Database credentials are rotated
- [ ] ALLOWED_ORIGINS is configured
- [ ] CRON_SECRET is set
- [ ] SMTP credentials are secure
- [ ] NextAuth secret is strong and unique
- [ ] Security headers are enabled
- [ ] Rate limiting is active
- [ ] Error logging is configured
- [ ] Monitoring is set up
- [ ] Backup strategy is implemented
- [ ] Security headers are verified (use securityheaders.com)
- [ ] OWASP Top 10 vulnerabilities are addressed

### Monitoring

- [ ] Set up error tracking (e.g., Sentry)
- [ ] Monitor rate limit violations
- [ ] Track failed login attempts
- [ ] Monitor API response times
- [ ] Set up uptime monitoring
- [ ] Configure security alerts

## Environment Variables

### Required

```env
# Database
DATABASE_URL=mongodb://...

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://yourdomain.com

# Security
CRON_SECRET=your-cron-secret
ALLOWED_ORIGINS=https://yourdomain.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Incident Response

### In Case of Security Breach

1. **Immediately:**
   - Disable affected services
   - Rotate all credentials
   - Review access logs

2. **Within 24 hours:**
   - Notify affected users
   - Patch vulnerabilities
   - Document the incident

3. **Within 7 days:**
   - Complete security audit
   - Implement additional safeguards
   - Update security policies

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
- [Security Headers](https://securityheaders.com/)

## Support

For security concerns, please contact: security@dr-nawaf.com

**DO NOT** disclose security vulnerabilities publicly.
