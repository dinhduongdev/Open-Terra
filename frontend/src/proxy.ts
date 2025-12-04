/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'vi',

  // Hide locale prefix in URL completely - both languages use same URL
  localePrefix: 'never',

  // Detect locale from cookie or Accept-Language header
  localeDetection: true
});

export default function proxy(request: NextRequest) {
  console.log('Proxy handling:', request.nextUrl.pathname);
  const response = intlMiddleware(request);
  console.log('Response status:', response.status);
  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
