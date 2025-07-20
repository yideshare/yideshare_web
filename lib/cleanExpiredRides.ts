import { prisma } from '@/lib/prisma'; 
import  logger  from '@/lib/logger';

// add this to a vercel cron script when deployed

async function closeExpiredRides() {
  const now = new Date();

  const result = await prisma.ride.updateMany({
    where: {
      endTime: {
        lt: now,
      },
      isClosed: false,
    },
    data: {
      isClosed: true,
    },
  });

  logger.info(`DB RIDE: Closed ${result.count} expired rides.`);
}

closeExpiredRides()
  .catch((error) => {
    logger.error('DB RIDE: Error closing expired rides:', error);
  });