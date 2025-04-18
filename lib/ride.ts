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

export async function findManyRides(quantity: number) {
  return prisma.ride.findMany({
    take: quantity,
    where: {
      isClosed: false,
    },
  });
}

export async function findOwnedRide(netId: string) {
  return prisma.ride.findMany({
    where: {
      ownerName: netId,
    },
    orderBy: {
      startTime: "desc",
    },
    select: {
      rideId: true,
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

export async function findBookmarkedRides(netId: string) {
  return prisma.bookmark.findMany({
    where: { netId },
    select: { ride: true },
  });
}

export async function findFilteredRides(
  from: string,
  to: string,
  startTime: Date,
  endTime: Date
) {
  // Build the where clause dynamically based on non-empty criteria
  const whereClause: any = {
    AND: [{ isClosed: false }],
  };

  // Only add location filters if they're not empty
  if (from) {
    whereClause.AND.push({
      beginning: {
        contains: from,
        mode: "insensitive",
      },
    });
  }
  if (to) {
    whereClause.AND.push({
      destination: {
        contains: to,
        mode: "insensitive",
      },
    });
  }

  // Only add time filters if they're valid dates
  if (startTime && !isNaN(startTime.getTime())) {
    whereClause.AND.push({ startTime: { gte: startTime } });
  }
  if (endTime && !isNaN(endTime.getTime())) {
    whereClause.AND.push({ endTime: { lte: endTime } });
  }

  return prisma.ride.findMany({
    where: whereClause,
    orderBy: {
      startTime: "asc",
    },
  });
}
