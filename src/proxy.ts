import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/auth';

export async function proxy(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const { nextUrl } = request;

  const isApiAuthRoute = nextUrl.pathname.startsWith('/api/auth');
  const isPublicRoute = ['/login', '/register'].includes(nextUrl.pathname);

  // Allow all API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from public routes to home
  if (isPublicRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    // Preserve the original destination
    if (nextUrl.pathname !== '/') {
      loginUrl.searchParams.set('from', nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Protect all routes except static assets, images, and favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
