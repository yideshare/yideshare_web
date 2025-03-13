import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRide } from "@/lib/utils/ride";
import { getAuthenticatedUser } from "@/lib/utils/user";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const authResult = await getAuthenticatedUser(cookieStore);
    const netID = authResult.user.netID;
    const ride = await request.json();
    const newRide = await createRide(ride, netID);

    return NextResponse.json(
      { message: "Ride created successfully", ride: newRide },
      { status: 201 }
    );
  } catch (error) {
    console.error("DB RIDE Error:", error);
    return NextResponse.json(
      { error: `Error creating ride ${error}` },
      { status: 500 }
    );
  }
}
