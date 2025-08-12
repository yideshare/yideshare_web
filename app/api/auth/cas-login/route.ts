import { NextResponse } from "next/server";

// Configure CAS login - using the main domain
const baseUrl = process.env.NEXTAUTH_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
const serviceURL = `${baseUrl}/api/auth/cas-validate`;

export async function GET() {
  // Redirect to Yale CAS login - this is exactly what YCrush does
  const yaleCASUrl = `https://secure.its.yale.edu/cas/login?service=${encodeURIComponent(serviceURL)}`;
  console.log("CAS Login - Service URL:", serviceURL);
  console.log("CAS Login - Redirecting to:", yaleCASUrl);
  return NextResponse.redirect(yaleCASUrl);
}
