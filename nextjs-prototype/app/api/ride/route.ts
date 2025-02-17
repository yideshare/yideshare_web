// api/auth/ride/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const ride = await request.json()
    const newRide = await prisma.ride.create({
        data: {
          beginning: ride.beginning,    
          destination: ride.destination,  
          startTime: ride.startTime,    
          endTime: ride.endTime,
          totalSeats: ride.totalSeats,
          ownerId: ride.ownerId,
        },
    })

    return NextResponse.json(
      { message: "Ride created successfully" }, 
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating ride" },
      { status: 500 }
    )
  }
}