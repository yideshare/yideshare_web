import { NextResponse } from "next/server";
import { createRide } from "@/lib/ride";
import { getUserNetIdFromCookies } from "@/lib/user";

export async function POST(request: Request) {
  try {
    // get netId
    const netId = await getUserNetIdFromCookies();

    // validate netId
    if (netId === null) {
      throw new Error("Cannot get user netId from cookies");
    }

    // fetch ride data and create new ride
    const ride = await request.json();
    const newRide = await createRide(ride, netId);

    return NextResponse.json(
      { message: "Ride created successfully", ride: newRide },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ride Create Error:", error);
    return NextResponse.json(
      { error: `Failed to create ride ${error}` },
      { status: 500 }
    );
  }
}
