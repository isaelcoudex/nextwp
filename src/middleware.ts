import { NextRequest, NextResponse } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n-config";
import type { Locale } from "@/lib/i18n-config";
export { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n-config";
export type { Locale } from "@/lib/i18n-config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Detecta locale no início do path: /en/... /es/... /fr/...
  const matchedLocale = LOCALES.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (matchedLocale) {
    // Remove o prefixo de locale do path para o rewrite interno
    const newPath = pathname.slice(matchedLocale.length + 1) || "/";
    const rewriteUrl = new URL(newPath, request.url);
    rewriteUrl.search = request.nextUrl.search;

    // Passa o locale via header para server components lerem
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", matchedLocale);

    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  // Sem prefixo = PT (idioma padrão)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", DEFAULT_LOCALE);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|ads.txt|robots.txt).*)",
  ],
};
