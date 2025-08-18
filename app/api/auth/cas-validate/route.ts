import { NextResponse } from "next/server";
import { findOrCreateUser } from "@/lib/user";
import { fetchYaliesData } from "@/lib/yalies";
import { validateCASTicket } from "@/lib/cas-validate";
import { withApiErrorHandler, ApiError } from "@/lib/withApiErrorHandler";

function getBaseUrl(req: Request) {
  try {
    return new URL(req.url).origin;
  } catch {
    return process.env.NEXTAUTH_URL || "http://localhost:3000";
  }
}

async function getHandler(req: Request) {
  const baseUrl = getBaseUrl(req);
  const serviceURL = `${baseUrl}/api/auth/cas-validate`;

  const { searchParams } = new URL(req.url);
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

  const successResponse = NextResponse.redirect(`${baseUrl}/feed`);
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
  console.log("CAS Validate - Redirecting to:", `${baseUrl}/feed`);
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
