import { prisma } from "@/lib/prisma";

export async function createRide(ride: any, netId: string) {
  return prisma.ride.create({
    data: {
      ownerId: netId,
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


export async function bookmarkRide(userId: string, rideId: string) {
  // try to find bookmark
  const existing = await prisma.bookmark.findUnique({
    where: { userId_rideId: { userId, rideId } },
  });

  // if a bookmark exists
  if (existing) {
    await prisma.bookmark.delete({
      where: { userId_rideId: { userId, rideId } },
    });
    return { bookmarked: false };
  // otherwise
  } else {
    await prisma.bookmark.create({
      data: { userId, rideId },
    });
    return { bookmarked: true };
  }
}
