import { NextResponse } from "next/server";
import { closeRide } from "@/lib/ride";
import { getUserNetIdFromCookies } from "@/lib/user"; // You might want to verify ownership later

interface Params {
  rideId?: string;
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  try {
    // Get the rideId from the route parameters
    const { rideId } = params;

    // Validate rideId
    if (!rideId) {
      return NextResponse.json({ error: "Missing rideId" }, { status: 400 });
    }

    // Optional: Authenticate user and verify ownership of the ride
    // const netId = await getUserNetIdFromCookies();
    // if (!netId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // const ride = await prisma.ride.findUnique({ where: { rideId } });
    // if (!ride || ride.ownerNetId !== netId) {
    //   return NextResponse.json({ error: "Unauthorized - Not ride owner" }, { status: 403 });
    // }

    // Close the ride
    const updatedRide = await closeRide(rideId);

    if (updatedRide) {
      return NextResponse.json({ message: `Ride #${rideId} closed successfully.` });
    } else {
      return NextResponse.json({ error: `Failed to close ride #${rideId}. Ride not found?` }, { status: 404 });
    }
  } catch (error) {
    console.error("Error closing ride:", error);
    return NextResponse.json({ error: "Failed to close ride" }, { status: 500 });
  }
}