import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user");
  if (userCookie) return NextResponse.next();
  const intended = request.nextUrl.pathname + request.nextUrl.search;
  const loginUrl = new URL("/api/auth/cas-login", request.url);
  loginUrl.searchParams.set("redirect", intended);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/feed/:path*", "/bookmarks/:path*", "/your-rides/:path*"],
};
