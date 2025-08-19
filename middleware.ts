import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userCookie = request.cookies.get("user");
  const isAuthenticated = Boolean(userCookie && userCookie.value);

  if (!isAuthenticated) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/"; // send to landing/login page
    // Preserve where the user wanted to go
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*", "/bookmarks/:path*", "/your-rides/:path*"],
};
