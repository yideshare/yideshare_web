import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const casLoginUrl = `https://secure.its.yale.edu/cas/login?service=${encodeURIComponent(baseUrl + "/api/auth/cas-validate")}`;
  
  return NextResponse.redirect(casLoginUrl);
}