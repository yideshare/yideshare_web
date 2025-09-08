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
  // Preserve redirect param from middleware 
  const { searchParams } = new URL(req.url);
  const redirectPath = searchParams.get("redirect") || "";

  const serviceURL =
    `${baseUrl}/api/auth/cas-validate` +
    (redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : "");

  const yaleCASUrl = `https://secure.its.yale.edu/cas/login?service=${encodeURIComponent(
    serviceURL
  )}`;
  return NextResponse.redirect(yaleCASUrl);
}
