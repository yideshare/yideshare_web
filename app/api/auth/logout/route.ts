import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function GET() {
  // response points to the login page
  const response = NextResponse.redirect(
    `https://secure.its.yale.edu/cas/logout?service=${BASE_URL}/`
  );

  // clear all cookies
  response.cookies.delete("user");
  response.cookies.delete("session");
  response.cookies.delete("session.sig");
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");

  return response;
}
