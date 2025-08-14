import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'; 
import  logger  from '@/lib/logger';
import { withApiErrorHandler } from "@/lib/withApiErrorHandler";

// add this to a vercel cron script when deployed

async function closeExpiredRides() {
  const now = new Date();
  
  // Log what rides will be closed for audit purposes
  const expiredRides = await prisma.ride.findMany({
    where: {
      endTime: {
        lt: now,
      },
      isClosed: false, // Only target rides that aren't already closed
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

  // Close the rides instead of deleting them
  const result = await prisma.ride.updateMany({
    where: {
      endTime: {
        lt: now,
      },
      isClosed: false, // Only update rides that aren't already closed
    },
    data: {
      isClosed: true,
    }
  });

  logger.info(`CRON: Closed ${result.count} expired rides`);
  
  return { ridesClosed: result.count };
}

// API route handler
async function handler(request: Request) {  // Add the request parameter
  // Check for API key
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.CRON_API_KEY) {
    logger.warn(`CRON: Unauthorized access attempt with key: ${apiKey?.substring(0, 4)}...`);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // If authorized, proceed with the cron job
  const result = await closeExpiredRides();
  return NextResponse.json({ success: true, ...result });
}

export const GET = withApiErrorHandler(handler);