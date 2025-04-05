import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRide } from "@/lib/utils/ride";
import { getUserNetIdFromCookies } from "@/lib/utils/user";

export async function POST(request: Request) {
  try {
    // get netId
    const cookieStore = await cookies();
    const netId = getUserNetIdFromCookies(cookieStore);

    // validate netId
    if (netId === null) {
      throw new Error("Cannot get user netId from cookies");
    }

    // fetch ride data and create new ride
    const ride = await request.json();
    const newRide = await createRide(ride, netId);
    console.log("NEWRIDE")
    console.log(newRide)

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
