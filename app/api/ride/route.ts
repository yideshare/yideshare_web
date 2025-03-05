import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookie = request.headers.get("cookie") || "";
    const match = cookie.match(/user=([^;]*)/);
    if (!match) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = JSON.parse(decodeURIComponent(match[1])); 
    console.log("User data:", userData);
    const netID = userData.netID; 
    console.log("NetID:", netID);

    const ride = await request.json()
    console.log("Creating ride:", ride)

    // Ensure the user exists in the database
    // let user = await prisma.user.findUnique({ //TODO: not adding to data base
    //   where: { netId: ride.ownerId },
    // });
    // console.log("User found:", user);
    // if (!user) {
    //   user = await prisma.user.create({ //TODO: update logic
    //     data: {
    //       netId: ride.ownerId,
    //       name: ride.ownerName || "Unknown", // Default name if missing
    //     },
    //   });
    // }

    // Create the ride with the existing user's netId
    const newRide = await prisma.ride.create({
      data: {
        ownerId: netID,
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
