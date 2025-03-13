import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { findOwnedRide } from "@/lib/utils/ride";
import { getAuthUserFromCookies } from "@/lib/utils/user";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authResult = await getAuthUserFromCookies(cookieStore);

    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const netId = authResult.user.netId;
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
