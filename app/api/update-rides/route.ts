import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure this is your Prisma instance
import { getUserNetIdFromCookies } from "@/lib/user"; // Utility to get the user from cookies

export async function DELETE(request: Request) {
  try {
    // Extract rideId from the query string (e.g., /api/rides/deleteRide?rideId=123)
    const url = new URL(request.url);
    const rideId = url.searchParams.get("rideId");

    if (!rideId) {
      return NextResponse.json({ error: "rideId is required" }, { status: 400 });
    }

    // Get the user's netId from cookies
    const netId = await getUserNetIdFromCookies();
    if (!netId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the ride exists
    const ride = await prisma.ride.findUnique({
      where: { rideId: rideId },
    });

    if (!ride) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    // Check if the current user is the owner of the ride
    if (ride.ownerNetId !== netId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this ride" },
        { status: 403 }
      );
    }

    // Delete any related records (e.g., bookmarks) before deleting the ride
    await prisma.bookmark.deleteMany({
      where: { rideId: ride.rideId },
    });

    // Delete the ride
    await prisma.ride.delete({
      where: { rideId: ride.rideId },
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

export async function PATCH(request: Request) {
  try {
    // Extract rideId from the query string
    const url = new URL(request.url);
    const rideId = url.searchParams.get("rideId");

    if (!rideId) {
      return NextResponse.json({ error: "rideId is required" }, { status: 400 });
    }

    // Get the user's netId from cookies
    const netId = await getUserNetIdFromCookies();
    if (!netId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the ride exists
    const existingRide = await prisma.ride.findUnique({
      where: { rideId: rideId },
    });

    if (!existingRide) {
      return NextResponse.json({ error: "Ride not found" }, { status: 404 });
    }

    // Check if the current user is the owner of the ride
    if (existingRide.ownerNetId !== netId) {
      return NextResponse.json(
        { error: "Unauthorized to edit this ride" },
        { status: 403 }
      );
    }

    // Get the updated ride data from the request body
    const updatedRideData = await request.json();

    // Update the ride
    const updatedRide = await prisma.ride.update({
      where: { rideId: existingRide.rideId },
      data: {
        beginning: updatedRideData.beginning?.toLowerCase(),
        destination: updatedRideData.destination?.toLowerCase(),
        description: updatedRideData.description,
        startTime: updatedRideData.startTime
          ? new Date(updatedRideData.startTime)
          : undefined,
        endTime: updatedRideData.endTime
          ? new Date(updatedRideData.endTime)
          : undefined,
        totalSeats: updatedRideData.totalSeats,
        ownerName: updatedRideData.ownerName,
        ownerPhone: updatedRideData.ownerPhone,
      },
    });

    return NextResponse.json(updatedRide);
  } catch (error) {
    console.error("Update Ride Error:", error);
    return NextResponse.json(
      { error: "Failed to update ride" },
      { status: 500 }
    );
  }
}
