import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Rate Limiting Config
const isDev = process.env.NODE_ENV || 'development';

const RATE_LIMITS = {
  auth: { limit: isDev ? 10000 : 240, windowMs: 60000 },      // 120 requests per minute in prod
  admin: { limit: isDev ? 10000 : 1200, windowMs: 60000 },   // 600 requests per minute in prod
  public: { limit: isDev ? 10000 : 2000, windowMs: 60000 }, // 1000 requests per minute in prod
};

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string, limit: number, windowMs: number): { allowed: boolean; retryAfter: number } {
  if (isDev) {
    return { allowed: true, retryAfter: 0 };
  }

  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (record.count >= limit) {
    const retryAfter = Math.ceil((record.expiresAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count += 1;
  return { allowed: true, retryAfter: 0 };
}

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. IP extraction for Rate Limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded ? forwarded.split(',')[0].trim() : (realIp?.trim() || '127.0.0.1');

  let rateLimitResult = { allowed: true, retryAfter: 0 };

  // Only apply rate limiting to API routes, not to page navigations and prefetching
  if (pathname.startsWith('/api/auth')) {
    rateLimitResult = checkRateLimit(`${ip}-auth`, RATE_LIMITS.auth.limit, RATE_LIMITS.auth.windowMs);
  } else if (pathname.startsWith('/api/admin')) {
    rateLimitResult = checkRateLimit(`${ip}-admin`, RATE_LIMITS.admin.limit, RATE_LIMITS.admin.windowMs);
  } else if (pathname.startsWith('/api')) {
    rateLimitResult = checkRateLimit(`${ip}-public`, RATE_LIMITS.public.limit, RATE_LIMITS.public.windowMs);
  }

  if (!rateLimitResult.allowed) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Too Many Requests</title>
          <style>
              body {
                  font-family: system-ui, -apple-system, sans-serif;
                  background-color: #f8fafc;
                  color: #0f172a;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
              }
              .container {
                  background: white;
                  padding: 40px;
                  border-radius: 24px;
                  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                  text-align: center;
                  max-width: 400px;
                  width: 90%;
                  border: 1px solid #e2e8f0;
              }
              .icon {
                  background: #fee2e2;
                  color: #ef4444;
                  width: 80px;
                  height: 80px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0 auto 24px;
              }
              .icon svg {
                  width: 40px;
                  height: 40px;
              }
              h1 {
                  font-size: 24px;
                  font-weight: 900;
                  margin: 0 0 16px;
              }
              p {
                  color: #64748b;
                  line-height: 1.6;
                  margin: 0 0 24px;
              }
              .btn {
                  display: inline-block;
                  background: #166534;
                  color: white;
                  font-weight: bold;
                  text-decoration: none;
                  padding: 12px 24px;
                  border-radius: 12px;
                  transition: all 0.2s;
              }
              .btn:hover {
                  background: #14532d;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
              </div>
              <h1>Too Many Requests</h1>
              <p>You're sending requests too quickly. Please slow down and try again in a moment.</p>
              <a href="#" onclick="window.location.reload(); return false;" class="btn">Try Again</a>
          </div>
      </body>
      </html>
      `,
      {
        status: 429,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Retry-After': String(rateLimitResult.retryAfter),
        },
      }
    );
  }

  // 2. Authentication Protection
  const pathWithoutLocale = pathname.replace(/^\/(en|gu)/, "") || "/";
  const isDashboard = pathWithoutLocale.startsWith("/dashboard");
  const isAdmin = pathWithoutLocale.startsWith("/admin");
  const isSuperAdmin = pathWithoutLocale.startsWith("/super-admin");
  const isAdminLogin = pathWithoutLocale === "/admin/login";
  const isSuperAdminLogin = pathWithoutLocale === "/super-admin-login";

  if ((isDashboard || isAdmin || isSuperAdmin) && !isAdminLogin && !isSuperAdminLogin) {
    const localeMatch = pathname.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : 'en';

    if (isDashboard) {
      // Regular user dashboard — protected by better-auth session
      const sessionCookie = request.cookies.get('better-auth.session_token') || request.cookies.get('__Secure-better-auth.session_token');
      if (!sessionCookie) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/membership/login`;
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
    } else {
      // Admin / Super-Admin routes — protected by admin_session JWT cookie
      const adminSessionCookie = request.cookies.get('admin_session');
      if (!adminSessionCookie) {
        const url = request.nextUrl.clone();
        if (isSuperAdmin) {
          url.pathname = `/${locale}/super-admin-login`;
        } else {
          url.pathname = `/${locale}/admin/login`;
        }
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
      }
    }
  }


  // 3. Internationalization (next-intl) and CORS
  let response: NextResponse;
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    response = NextResponse.next();
  } else {
    response = intlMiddleware(request);
  }

  // SECURITY: Add CORS headers for API routes (MEDIUM-006)
  if (pathname.startsWith('/api')) {
    // Only allow specific domains in production, or * for public APIs
    // Using * here for public APIs, but restrict Methods/Headers.
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/api/:path*']
};
