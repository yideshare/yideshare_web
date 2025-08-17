import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'; 
import  logger  from '@/lib/logger';
import { withApiErrorHandler } from "@/lib/withApiErrorHandler";

// add this to a vercel cron script when deployed
// currently closing them (but not permanently deleting them) - trying this first and then will update

async function closeExpiredRides() {
  const now = new Date();
  
  // Log what rides will be closed
  const expiredRides = await prisma.ride.findMany({
    where: {
      endTime: {
        lt: now,
      },
      isClosed: false, 
    },
    select: {
      rideId: true,
      beginning: true,
      destination: true,
      startTime: true,
      endTime: true,
    }
  });
  
  logger.info(`CRON: Found ${expiredRides.length} expired rides to close`);
  
  if (expiredRides.length > 0) {
    logger.info(`CRON: Ride details:`, expiredRides);
  }

  // Close the rides 
  const result = await prisma.ride.updateMany({
    where: {
      endTime: {
        lt: now,
      },
      isClosed: false,
    },
    data: {
      isClosed: true,
    }
  });

  logger.info(`CRON: Closed ${result.count} expired rides`);
  
  return { ridesClosed: result.count };
}

// API route handler
async function handler() {
  const result = await closeExpiredRides();
  return NextResponse.json({ success: true, ...result });
}

export const GET = withApiErrorHandler(handler);