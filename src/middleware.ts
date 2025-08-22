import { NextResponse } from 'next/server';
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
};
