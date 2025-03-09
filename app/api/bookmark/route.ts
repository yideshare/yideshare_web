// app/api/bookmark/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // Get and validate the user cookie
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (!userCookie) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(userCookie.value);
    } catch (error) {
      return NextResponse.json({ error: "Invalid cookie format" }, { status: 400 });
    }
    const { netID } = parsedUser;

    // Validate the request payload
    let rideId;
    try {
      const body = await req.json();
      rideId = body.rideId;
      if (!rideId) {
        throw new Error("Missing rideId");
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    // Check if the bookmark exists using a composite unique index
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_rideId: {
          userId: netID,
          rideId: rideId,
        },
      },
    });

    if (existing) {
      // Remove the bookmark (toggle off)
      await prisma.bookmark.delete({
        where: { userId_rideId: { userId: netID, rideId: rideId } },
      });
      return NextResponse.json({ bookmarked: false });
    } else {
      // Create the bookmark (toggle on)
      await prisma.bookmark.create({
        data: {
          userId: netID,
          rideId: rideId,
        },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
