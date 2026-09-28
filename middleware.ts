import { NextResponse, type NextRequest } from 'next/server';

/**
 * Fast route protection: /portal and /admin require a session cookie.
 * The server pages still validate the session against the store —
 * this middleware only prevents unauthenticated rendering entirely
 * (and produces proper 307 redirects in every environment).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('kiln_session')?.value;

  // /portal/forgot and /portal/reset must stay open — reset links arrive by email
  // from users who are (by definition) not signed in.
  const isPortal =
    pathname.startsWith('/portal') &&
    pathname !== '/portal/login' &&
    pathname !== '/portal/forgot' &&
    pathname !== '/portal/reset';
  const isAdmin = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if ((isPortal || isAdmin) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = isAdmin ? '/admin/login' : '/portal/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
};
