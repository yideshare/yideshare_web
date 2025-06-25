import { prisma } from "@/lib/prisma";
import { Ride } from "@prisma/client"

export async function createRide(ride: Ride, netId: string) {
  try {
    const newRide = await prisma.ride.create({
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
    console.log("Ride created successfully:", newRide);
    return newRide;
  } catch (error) {
    console.error("Error creating ride:", error);
    throw error;
  }
}

export async function closeRide(rideId: string) {
  try {
    const updatedRide = await prisma.ride.update({
      where: { rideId },
      data: { isClosed: true },
    });
    return updatedRide;
  } catch (error) {
    console.error("Error closing ride:", error);
    return null; 
  }
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
  filterStartTime: Date,
  filterEndTime: Date
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
      },
    });
  }
  if (to) {
    whereClause.AND.push({
      destination: {
        contains: to,
      },
    });
  }

  const hasStart = filterStartTime && !isNaN(filterStartTime.getTime());
  const hasEnd   = filterEndTime   && !isNaN(filterEndTime.getTime());

  if (hasStart && hasEnd) {
    whereClause.AND.push({
      OR: [
        {
          startTime: {
            gte: filterStartTime,
            lte: filterEndTime,
          }
        },
        {
          endTime: {
            gte: filterStartTime,
            lte: filterEndTime,
          }
        }
      ]
    });
  } 

  return prisma.ride.findMany({
    where: whereClause,
    orderBy: {
      startTime: "asc",
    },
  });
}

