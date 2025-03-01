import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect("https://secure.its.yale.edu/cas/logout?service=http://localhost:3000/");

  response.cookies.delete("user");
  response.cookies.delete("session");
  response.cookies.delete("session.sig");
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");

  return response
}