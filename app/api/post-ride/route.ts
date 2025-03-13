import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRide } from "@/lib/utils/ride";
import { getAuthUserFromCookies } from "@/lib/utils/user";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const authResult = await getAuthUserFromCookies(cookieStore);
    const netId = authResult.user.netId;
    const ride = await request.json();
    const newRide = await createRide(ride, netId);

    return NextResponse.json(
      { message: "Ride created successfully", ride: newRide },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ride Create Error:", error);
    return NextResponse.json(
      { error: `Failed to create ride ${error}` },
      { status: 500 }
    );
  }
}
