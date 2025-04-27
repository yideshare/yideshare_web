import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserNetIdFromCookies } from "@/lib/user";

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

    // const rideId = await Promise.resolve(params.rideId);
    const rideId = params.rideId;

    // Find the ride to ensure it exists and belongs to the user
    const ride = await prisma.ride.findUnique({
      where: { rideId },
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

    // First delete any related records (bookmarks)
    await prisma.bookmark.deleteMany({
      where: { rideId },
    });

    // Then delete the ride
    await prisma.ride.delete({
      where: { rideId },
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

export async function PATCH(
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

    // const rideId = await Promise.resolve(params.rideId);
    const rideId = params.rideId;

    // Find the ride to ensure it exists and belongs to the user
    const existingRide = await prisma.ride.findUnique({
      where: { rideId },
    });

    if (!existingRide) {
      return NextResponse.json(
        { error: "Ride not found" },
        { status: 404 }
      );
    }

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
      where: { rideId },
      data: {
        beginning: updatedRideData.beginning?.toLowerCase(),
        destination: updatedRideData.destination?.toLowerCase(),
        description: updatedRideData.description,
        startTime: updatedRideData.startTime ? new Date(updatedRideData.startTime) : undefined,
        endTime: updatedRideData.endTime ? new Date(updatedRideData.endTime) : undefined,
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