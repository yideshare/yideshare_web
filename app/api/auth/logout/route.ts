import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  // response points to the login page
  const response = NextResponse.redirect(
    `https://secure.its.yale.edu/cas/logout?service=${baseUrl}/`
  );

  // clear all cookies
  response.cookies.delete("user");
  response.cookies.delete("session");
  response.cookies.delete("session.sig");
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");

  return response;
}
