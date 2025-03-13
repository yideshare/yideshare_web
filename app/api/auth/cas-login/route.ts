import { NextResponse } from "next/server";

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
const yaleCASUrl = `https://secure.its.yale.edu/cas/login?service=${encodeURIComponent(
  `${baseUrl}/api/auth/cas-validate`
)}`;

export async function GET() {
  return NextResponse.redirect(yaleCASUrl);
}
