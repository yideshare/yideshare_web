import { NextResponse } from "next/server";

import { bookmarkRide } from "@/lib/ride";
import { getUserNetIdFromCookies } from "@/lib/user";
import { extractRideIdFromPayload } from "@/lib/validate";

export async function POST(req: Request) {
  try {
    // get netId and rideId
    const netId = await getUserNetIdFromCookies();
    const rideId = await extractRideIdFromPayload(req);

    // validate netId
    if (netId === null) {
      throw new Error("Cannot get user netId from cookies");
    }

    // validate request payload (rideId)
    if (rideId === null) {
      throw new Error("Request payload does not contain user netId");
    }

    // toggle the bookmark
    const result = await bookmarkRide(netId, rideId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Bookmark Error:", error);
    return NextResponse.json(
      { error: `Failed to bookmark ride: ${error}` },
      { status: 500 }
    );
  }
}
