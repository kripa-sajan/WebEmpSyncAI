/*import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // If the user has a token and is trying to access the sign-in page, redirect to the dashboard.
  if (accessToken && pathname.startsWith('/auth/sign-in')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user does not have a token and is trying to access the dashboard, redirect to the sign-in page.
  if (!accessToken && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/sign-in'],
};*/
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ Small helper to decode JWT without external libs
function decodeJwt(token: string): any | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;

    const payload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  if (token) {
    const decoded = decodeJwt(token);

    // If decoding failed → invalid token
    if (!decoded) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      const response = NextResponse.redirect(url);
      response.cookies.delete("access_token");
      return response;
    }

    // Check expiry (exp is in seconds)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/sign-in";
      const response = NextResponse.redirect(url);
      response.cookies.delete("access_token");
      return response;
    }

    // If logged in and tries to access sign-in → go dashboard
    if (pathname.startsWith("/auth/sign-in")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // No token and trying to access dashboard → sign in
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/sign-in"],
};
