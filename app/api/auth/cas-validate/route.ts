import { NextResponse } from "next/server";
import { findOrCreateUser } from "@/lib/user";
import { fetchYaliesData } from "@/lib/yalies";
import { validateCASTicket } from "@/lib/cas-validate";
import { withApiErrorHandler, ApiError } from "@/lib/withApiErrorHandler";

// Always use the main domain, not the deployment-specific URL
const BASE_URL = process.env.NEXTAUTH_URL || "https://yideshare-1mw1.vercel.app";

async function getHandler(req: Request) {
  // extract ticket from search params
  const { searchParams } = new URL(req.url);
  const ticket = searchParams.get("ticket");

  console.log("CAS Validate - Received ticket:", ticket ? "present" : "missing");

  if (!ticket) {
    throw new ApiError("No CAS ticket provided", 400);
  }

  // Use the new CAS validation function that mimics YCrush's approach
  const netId = await validateCASTicket(ticket);
  
  if (!netId) {
    console.error("CAS Validate - Failed to validate ticket");
    throw new ApiError("CAS ticket validation failed", 400);
  }

  console.log("CAS Validate - Successfully extracted netId:", netId);

  // fetch Yalies data
  const yaliesData = await fetchYaliesData(netId);
  if (!yaliesData) {
    console.error("CAS Validate - No Yalies data found for netId:", netId);
    throw new ApiError(`Yalies returned no data for netId ${netId}`, 404);
  }

  // extract Yalies data
  const { first_name: firstName, last_name: lastName, email } = yaliesData;

  // ensure user exists in the database
  await findOrCreateUser(netId, firstName, lastName, email);

  // set response cookies with better settings
  const successResponse = NextResponse.redirect(`${BASE_URL}/feed`);
  successResponse.cookies.set(
    "user",
    JSON.stringify({ firstName, lastName, email, netId }),
    { 
      httpOnly: false, 
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  );

  console.log("CAS Validate - Successfully authenticated user:", netId);
  console.log("CAS Validate - Redirecting to:", `${BASE_URL}/feed`);
  return successResponse;
}

export const GET = withApiErrorHandler(async (req: Request) => {
  try {
    return await getHandler(req);
  } catch (error) {
    console.error("CAS Validate - Error in handler:", error);
    return NextResponse.redirect(BASE_URL);
  }
});
