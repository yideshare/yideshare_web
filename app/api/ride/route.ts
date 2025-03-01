// api/auth/ride/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const ride = await request.json()
    console.log("Creating ride:", ride)
    const newRide = await prisma.ride.create({

        data: {
          ownerId: "ns2235", // hardcode
          ownerName: ride.ownerName || "", // Optional field 
          ownerPhone: ride.ownerPhone || "", // Optional field
          beginning: ride.beginning,    
          destination: ride.destination,  
          description: ride.description || "", // Optional field
          startTime: new Date(ride.startTime),    
          endTime: new Date(ride.endTime),
          totalSeats: ride.totalSeats || 4, // Default value when ride is created
          currentTakenSeats: 0,  // Default value when ride is created
          isClosed: false, // Ride should be open by default
        },
    })

    return NextResponse.json(
      { message: "Ride created successfully" }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating ride (Full details):", error)
    return NextResponse.json(
      { message: "Error creating ride" },
      { status: 500 }
    )
  }
}