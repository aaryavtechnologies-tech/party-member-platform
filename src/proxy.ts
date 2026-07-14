import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Rate Limiting Config
const RATE_LIMITS = {
  auth: { limit: 5, windowMs: 60000 },     // 5 requests per minute
  admin: { limit: 60, windowMs: 60000 },   // 60 requests per minute
  public: { limit: 100, windowMs: 60000 }, // 100 requests per minute
};

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true; // Allowed
  }

  if (record.count >= limit) {
    return false; // Rate limited
  }

  record.count += 1;
  return true; // Allowed
}

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. IP extraction for Rate Limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown-ip';

  let isAllowed = true;
  if (pathname.startsWith('/api/auth')) {
    isAllowed = checkRateLimit(`${ip}-auth`, RATE_LIMITS.auth.limit, RATE_LIMITS.auth.windowMs);
  } else if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    isAllowed = checkRateLimit(`${ip}-admin`, RATE_LIMITS.admin.limit, RATE_LIMITS.admin.windowMs);
  } else if (pathname.startsWith('/api')) {
    isAllowed = checkRateLimit(`${ip}-public`, RATE_LIMITS.public.limit, RATE_LIMITS.public.windowMs);
  }

  if (!isAllowed) {
    return new NextResponse('Too Many Requests. Please try again later.', { status: 429 });
  }

  // 2. Authentication Protection
  const isProtected = pathname.includes('/dashboard') || pathname.includes('/admin');
  
  if (isProtected) {
    const sessionCookie = request.cookies.get('better-auth.session_token') || request.cookies.get('__Secure-better-auth.session_token');
    
    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : 'en';
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
  }

  // 3. Internationalization (next-intl)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/api/:path*']
};
