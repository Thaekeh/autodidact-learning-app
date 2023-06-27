import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { getRouteForLogin } from "./utils/routing/authentication";
import { isAdmin } from "./utils/profile/is-admin";
import { getProfileByUserId } from "./utils";
import { getRouteForDashboard } from "./utils/routing/general";
import { createUrl } from "./utils/routing/create-url";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const profile = await getProfileByUserId(supabase, session?.user?.id);
  if (!session) {
    const loginUrl = createUrl(getRouteForLogin(), req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (req.nextUrl.pathname.includes("admin") && !isAdmin(profile)) {
    return NextResponse.redirect(createUrl(getRouteForDashboard(), req.url));
  }
  return res;
}

export const config = {
  matcher: "/main/:path*",
};
