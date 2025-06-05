import { prisma } from '@/lib/prisma'; 

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

  console.log(`DB RIDE Alert: Closed ${result.count} expired rides.`);
}

closeExpiredRides()
  .catch((e) => {
    console.error('DB RIDE Error: ', e);
  });