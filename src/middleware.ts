import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const ADMIN_ROUTES = ["/admin"];
const DASHBOARD_ROUTES = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix to get the real path (e.g. /en/admin/dashboard → /admin/dashboard)
  const pathWithoutLocale = pathname.replace(/^\/(en|gu)/, "") || "/";

  const isAdminRoute = ADMIN_ROUTES.some((r) => pathWithoutLocale.startsWith(r));
  const isDashboardRoute = DASHBOARD_ROUTES.some((r) => pathWithoutLocale.startsWith(r));
  const isAdminLoginPage = pathWithoutLocale === "/admin/login";

  if (isAdminRoute && !isAdminLoginPage) {
    // Check session via better-auth
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      // Not logged in → redirect to admin login
      const locale = pathname.split("/")[1];
      const validLocale = ["en", "gu"].includes(locale) ? locale : "en";
      const loginUrl = new URL(`/${validLocale}/admin/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN") {
      // Logged in but not an admin → redirect to home
      const locale = pathname.split("/")[1];
      const validLocale = ["en", "gu"].includes(locale) ? locale : "en";
      return NextResponse.redirect(new URL(`/${validLocale}`, request.url));
    }
  }

  if (isDashboardRoute) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      const locale = pathname.split("/")[1];
      const validLocale = ["en", "gu"].includes(locale) ? locale : "en";
      const loginUrl = new URL(`/${validLocale}/membership/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all locale-prefixed routes
    "/(en|gu)/:path*",
    // Match root (for default locale redirect)
    "/",
  ],
};
