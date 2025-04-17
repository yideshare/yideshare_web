import { NextResponse } from "next/server";

import { findOwnedRide } from "@/lib/utils/ride";
import { getUserNetIdFromCookies } from "@/lib/utils/user";

export async function GET() {
  try {
    // get netId
    const netId = await getUserNetIdFromCookies();

    // validate netId
    if (netId === null) {
      throw new Error("Cannot get user netId from cookies");
    }

    // fetch rides
    const userRides = await findOwnedRide(netId);

    return NextResponse.json({ rides: userRides });
  } catch (error) {
    console.error("Ride Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rides" },
      { status: 500 }
    );
  }
}
