import { prisma } from "@/lib/prisma";

export async function createRide(ride: any, netId: string) {
  return prisma.ride.create({
    data: {
      ownerNetId: netId,
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
}

export async function bookmarkRide(netId: string, rideId: string) {
  // try to find bookmark
  const existing = await prisma.bookmark.findUnique({
    where: { netId_rideId: { netId, rideId } },
  });

  // if a bookmark exists
  if (existing) {
    await prisma.bookmark.delete({
      where: { netId_rideId: { netId, rideId } },
    });
    return { bookmarked: false };
    // otherwise
  } else {
    await prisma.bookmark.create({
      data: { netId, rideId },
    });
    return { bookmarked: true };
  }
}

export async function findOwnedRide(netId: string) {
  return await prisma.ride.findMany({
    where: {
      ownerName: netId,
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
}
