import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const SUPABASE_AUTH_COOKIE = /^sb-.*-auth-token/;

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getClaims() verifies the session JWT *locally* (via the project's JWKS) when
  // asymmetric signing keys are enabled, so this gate costs no network round-trip
  // on the hot path. It only calls the Auth server when the token is missing or
  // actually needs refreshing, where it also persists refreshed cookies via
  // setAll above — keeping sessions alive exactly as getUser() did.
  const { data, error } = await supabase.auth.getClaims();
  const user = data?.claims ?? null;

  if (error) {
    for (const { name } of request.cookies.getAll()) {
      if (SUPABASE_AUTH_COOKIE.test(name)) {
        response.cookies.set(name, '', { maxAge: 0, path: '/' });
      }
    }
  }

  const path = request.nextUrl.pathname;
  const isLogin = path === '/admin/login';

  const withCookies = (redirect: NextResponse) => {
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (!user && !isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/admin/login';
    redirect.searchParams.set('next', path);
    return withCookies(NextResponse.redirect(redirect));
  }
  if (user && isLogin) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = '/admin';
    return withCookies(NextResponse.redirect(redirect));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
