import { NextResponse } from "next/server";
import { findOrCreateUser } from "@/lib/user";
import { fetchYaliesData } from "@/lib/yalies";
import { validateCASTicket } from "@/lib/cas-validate";
import { withApiErrorHandler, ApiError } from "@/lib/withApiErrorHandler";

function getBaseUrl(req: Request) {
  try {
    return new URL(req.url).origin;
  } catch {
    if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  }
}

const ALLOWED_REDIRECT_PREFIXES = ["/feed", "/bookmarks", "/your-rides"];

function resolveSafeRedirect(
  redirectPath: string | null,
  baseUrl: string
): string {
  if (!redirectPath || !redirectPath.startsWith("/")) {
    return `${baseUrl}/feed`;
  }
  for (const prefix of ALLOWED_REDIRECT_PREFIXES) {
    if (redirectPath === prefix || redirectPath.startsWith(prefix + "/")) {
      return new URL(redirectPath, baseUrl).toString();
    }
  }
  return `${baseUrl}/feed`;
}

async function getHandler(req: Request) {
  const baseUrl = getBaseUrl(req);
  const { searchParams } = new URL(req.url);
  const redirectPath = searchParams.get("redirect");
  const serviceURL = `${baseUrl}/api/auth/cas-validate${
    redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""
  }`;

  const ticket = searchParams.get("ticket");

  console.log(
    "CAS Validate - Received ticket:",
    ticket ? "present" : "missing"
  );

  if (!ticket) {
    throw new ApiError("No CAS ticket provided", 400);
  }

  // Validate using the SAME service URL used during login
  const netId = await validateCASTicket(ticket, serviceURL);

  if (!netId) {
    console.error("CAS Validate - Failed to validate ticket");
    throw new ApiError("CAS ticket validation failed", 400);
  }

  console.log("CAS Validate - Successfully extracted netId:", netId);

  const yaliesData = await fetchYaliesData(netId);
  if (!yaliesData) {
    console.error("CAS Validate - No Yalies data found for netId:", netId);
    throw new ApiError(`Yalies returned no data for netId ${netId}`, 404);
  }

  const { first_name: firstName, last_name: lastName, email } = yaliesData;

  await findOrCreateUser(netId, firstName, lastName, email);

  const redirectTo = resolveSafeRedirect(redirectPath, baseUrl);

  const successResponse = NextResponse.redirect(redirectTo);
  successResponse.cookies.set(
    "user",
    JSON.stringify({ firstName, lastName, email, netId }),
    {
      httpOnly: false,
      path: "/",
      secure: baseUrl.startsWith("https"),
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    }
  );

  console.log("CAS Validate - Successfully authenticated user:", netId);
  console.log("CAS Validate - Redirecting to:", redirectTo);
  return successResponse;
}

export const GET = withApiErrorHandler(async (req: Request) => {
  try {
    return await getHandler(req);
  } catch (error) {
    console.error("CAS Validate - Error in handler:", error);
    // Redirect back to the same origin instead of a build-time env
    const baseUrl = getBaseUrl(req);
    return NextResponse.redirect(baseUrl);
  }
});
