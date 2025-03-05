import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export async function GET() {


  try {
    const cookieStore = await cookies()
    const netID = cookieStore.get("session")?.value 

    if (!netID) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userRides = await prisma.ride.findMany({
    //   where: {
    //     ownerName: netID, //TODO: update logic, waiting on Nikita
    //   },
      orderBy: {
        startTime: "desc",  // Sort rides by most recent
      },
      select: {
        id: true,
        beginning: true,
        destination: true,
        startTime: true,
        endTime: true,
        totalSeats: true,
        currentTakenSeats: true,
        isClosed: true,
      },
    })

    return NextResponse.json({ rides: userRides })
  } catch (error) {
    console.error("Error fetching user rides:", error)
    return NextResponse.json({ error: "Failed to fetch rides" }, { status: 500 })
  }
}