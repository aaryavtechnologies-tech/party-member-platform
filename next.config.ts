import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // SECURITY: Restrict to specific trusted domains only
      // Wildcard (**) was removed — it is an SSRF risk
      {
        protocol: 'https',
        hostname: 'rashtriyaannadatavikasparty.org',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Add specific CDN domains as required — never use **
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // SECURITY: Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // SECURITY: Strict Transport Security — force HTTPS for 2 years
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // SECURITY: Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // SECURITY: Restrict browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://api.razorpay.com")',
          },
          // SECURITY: Prevent clickjacking (also covered by CSP frame-ancestors below)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // SECURITY: Disable DNS prefetch control for privacy
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // SECURITY: Content-Security-Policy
          // Built specifically for this application's dependencies:
          // - Razorpay Checkout (checkout.razorpay.com)
          // - Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
          // - Inline styles required by Next.js and Tailwind
          {
            key: 'Content-Security-Policy',
            value: [
              // Default: block everything not explicitly allowed
              "default-src 'self'",
              // Scripts: self + Razorpay checkout (required for payments)
              "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com",
              // Note: 'unsafe-inline' is required by Next.js for inline scripts.
              // If you can use nonces (custom server), remove unsafe-inline.
              // Styles: self + inline (required by Tailwind/Next.js) + Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + data URIs (for QR codes) + HTTPS
              "img-src 'self' data: https:",
              // Connections: self + Razorpay API + Resend (no client-side calls)
              "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com",
              // Frames: Razorpay checkout iframe
              "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
              // Prevent framing by external sites (clickjacking protection)
              "frame-ancestors 'self'",
              // Object/embed
              "object-src 'none'",
              // Base URI restriction
              "base-uri 'self'",
              // Form targets
              "form-action 'self'",
              // Upgrade insecure requests
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
