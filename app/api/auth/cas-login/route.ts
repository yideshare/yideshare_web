import { NextResponse } from "next/server";

// Build base URL from the incoming request (works for preview/prod/local)
function getBaseUrl(req: Request) {
  try {
    return new URL(req.url).origin;
  } catch {
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
  }
}

export async function GET(req: Request) {
  const baseUrl = getBaseUrl(req);
  const serviceURL = `${baseUrl}/api/auth/cas-validate`;

  const yaleCASUrl = `https://secure.its.yale.edu/cas/login?service=${encodeURIComponent(
    serviceURL
  )}`;
  console.log("CAS Login - Service URL:", serviceURL);
  console.log("CAS Login - Redirecting to:", yaleCASUrl);
  return NextResponse.redirect(yaleCASUrl);
}
