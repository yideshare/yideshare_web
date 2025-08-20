import { NextResponse } from "next/server";

function getBaseUrl(): string {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function GET() {
  const baseUrl = getBaseUrl();

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
