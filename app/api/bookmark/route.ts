// app/api/auth/toggleBookmark.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }
  
  const { netID } = JSON.parse(userCookie.value);
  const { rideId } = await req.json();

  // Check if the bookmark exists
  const existing = await prisma.bookmark.findUnique({
    where: {
      // Using composite unique index: userId + rideId
      userNetId_rideId: {
        userNetId: netID,
        rideId: rideId,
      },
    },
  });

  if (existing) {
    // Remove the bookmark (toggle off)
    await prisma.bookmark.delete({
      where: { userNetId_rideId: { userNetId: netID, rideId: rideId } },
    });
    return NextResponse.json({ bookmarked: false });
  } else {
    // Create the bookmark (toggle on)
    await prisma.bookmark.create({
      data: {
        userNetId: netID,
        rideId: rideId,
      },
    });
    return NextResponse.json({ bookmarked: true });
  }
}