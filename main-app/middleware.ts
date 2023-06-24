import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { getRouteForLogin } from "./utils/routing/authentication";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    const loginUrl = new URL(getRouteForLogin(), req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: "/main/:path*",
};
