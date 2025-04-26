import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserNetIdFromCookies } from "@/lib/utils/user";

export async function DELETE(
  request: Request,
  { params }: { params: { rideId: string } }
) {
  try {
    // Get the user's netId
    const netId = await getUserNetIdFromCookies();
    if (!netId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the ride to ensure it exists and belongs to the user
    const ride = await prisma.ride.findUnique({
      where: { rideId: params.rideId },
    });

    if (!ride) {
      return NextResponse.json(
        { error: "Ride not found" },
        { status: 404 }
      );
    }

    if (ride.ownerNetId !== netId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this ride" },
        { status: 403 }
      );
    }

    // Delete the ride
    await prisma.ride.delete({
      where: { rideId: params.rideId },
    });

    return NextResponse.json(
      { message: "Ride deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Ride Error:", error);
    return NextResponse.json(
      { error: "Failed to delete ride" },
      { status: 500 }
    );
  }
} 