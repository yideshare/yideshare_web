import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/utils/user";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authResult = await getAuthenticatedUser(cookieStore);

    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const netID = authResult.user.netID;

    const userRides = await prisma.ride.findMany({
      where: {
        ownerName: netID,
      },
      orderBy: {
        startTime: "desc", // Sort rides by most recent
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
    });

    return NextResponse.json({ rides: userRides });
  } catch (error) {
    console.error("Error fetching user rides:", error);
    return NextResponse.json(
      { error: "Failed to fetch rides" },
      { status: 500 }
    );
  }
}
