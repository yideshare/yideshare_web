import { NextResponse } from "next/server";
import { findOwnedRide } from "@/lib/ride";
import { getUserNetIdFromCookies } from "@/lib/user";
import { withApiErrorHandler, ApiError } from "@/lib/withApiErrorHandler";

async function getHandler() {
  // get netId
  const netId = await getUserNetIdFromCookies();

  // validate netId
  if (netId === null) {
    throw new ApiError("Cannot get user netId from cookies", 401);
  }

  // fetch rides
  const userRides = await findOwnedRide(netId);

  return NextResponse.json({ rides: userRides });
}

export const GET = withApiErrorHandler(getHandler);
