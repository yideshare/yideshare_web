import { NextResponse } from "next/server";
import { bookmarkRide } from "@/lib/ride";
import { getUserNetIdFromCookies } from "@/lib/user";
import { extractRideIdFromPayload } from "@/lib/validate";
import { withApiErrorHandler, ApiError } from "@/lib/withApiErrorHandler";

async function postHandler(req: Request) {
  // get netId and rideId
  const netId = await getUserNetIdFromCookies();
  const rideId = await extractRideIdFromPayload(req);

  // validate netId
  if (netId === null) {
    throw new ApiError("Cannot get user netId from cookies", 401);
  }

  // validate request payload (rideId)
  if (rideId === null) {
    throw new ApiError("Request payload does not contain rideId", 400);
  }

  // toggle the bookmark
  const result = await bookmarkRide(netId, rideId);

  return NextResponse.json(result);
}

export const POST = withApiErrorHandler(postHandler);
