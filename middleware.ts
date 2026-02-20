import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // First update the supabase session
  const supabaseResponse = await updateSession(request);
  
  // If updateSession returns a redirect, return it immediately
  if (supabaseResponse.status === 307 || supabaseResponse.status === 302) {
    return supabaseResponse;
  }

  // Then run the i18n middleware
  // Note: we don't easily combine the responses here without more complex logic
  // but next-intl will generate its own response.
  // We should ideally pass the cookies from supabaseResponse to the final response.
  const response = await intlMiddleware(request);
  
  // Copy over cookies from supabaseResponse to the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, {
      ...cookie,
    });
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
