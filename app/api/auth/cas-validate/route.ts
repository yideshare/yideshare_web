import { NextResponse } from "next/server";
import { findOrCreateUser } from "@/lib/user";
import { fetchYaliesData } from "@/lib/yalies";
import { extractNetIdFromCASTicket } from "@/lib/validate";
import { withApiErrorHandler, ApiError } from "@/lib/withApiErrorHandler";

const BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

async function getHandler(req: Request) {
  // extract ticket from search params
  const { searchParams } = new URL(req.url);
  const ticket = searchParams.get("ticket");

  // validate CAS ticket
  const netId = await extractNetIdFromCASTicket(ticket);
  if (!netId) {
    throw new ApiError("Could not extract netId from CAS ticket", 400);
  }

  // fetch Yalies data
  const yaliesData = await fetchYaliesData(netId);
  if (!yaliesData) {
    throw new ApiError(`Yalies returned no data for netId ${netId}`, 404);
  }

  // extract Yalies data
  const { first_name: firstName, last_name: lastName, email } = yaliesData;

  // ensure user exists in the database
  await findOrCreateUser(netId, firstName, lastName, email);

  // set response cookies
  const successResponse = NextResponse.redirect(`${BASE_URL}/feed`);
  successResponse.cookies.set(
    "user",
    JSON.stringify({ firstName, lastName, email, netId }),
    { httpOnly: false, path: "/" }
  );

  return successResponse;
}

export const GET = withApiErrorHandler(async (req: Request) => {
  try {
    return await getHandler(req);
  } catch {
    return NextResponse.redirect(BASE_URL);
  }
});
