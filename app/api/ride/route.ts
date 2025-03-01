import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const ride = await request.json()
    console.log("Creating ride:", ride)
    console.log("Owner ID:", ride.ownerId);

    // Ensure the user exists in the database
    let user = await prisma.user.findUnique({
      where: { netId: ride.ownerId },
    });
    console.log("User found:", user);
    if (!user) {
      user = await prisma.user.create({
        data: {
          netId: ride.ownerId,
          name: ride.ownerName || "Unknown", // Default name if missing
        },
      });
    }

    // Create the ride with the existing user's netId
    const newRide = await prisma.ride.create({
      data: {
        owner: {
          connect: { netId: user.netId }, // Connect to existing user
        },
        ownerName: ride.ownerName || "", 
        ownerPhone: ride.ownerPhone || "", 
        beginning: ride.beginning,    
        destination: ride.destination,  
        description: ride.description || "", 
        startTime: new Date(ride.startTime),    
        endTime: new Date(ride.endTime),
        totalSeats: ride.totalSeats || 4, 
        currentTakenSeats: 0,  
        isClosed: false, 
      },
    });

    return NextResponse.json(
      { message: "Ride created successfully", ride: newRide }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ride (Full details):", error);
    // Ensure error is passed as a string to avoid issues with null
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: "Error creating ride", error: errorMessage },
      { status: 500 }
    );
  }
}
