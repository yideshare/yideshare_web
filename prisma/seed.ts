import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Ensure user exists (create only if not found)
  let user = await prisma.user.findUnique({
    where: { netId: "test_netid" },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        netId: "test_netid",
        name: "Lena Qian",
      },
    });
  }

  // Create a ride associated with the existing user
  await prisma.ride.create({
    data: {
      owner: {
        connect: { netId: user.netId }, // Connect instead of create
      },
      ownerName: user.name,
      ownerPhone: "123-456-7890",
      beginning: "Yale",
      destination: "Hartford",
      description: "Test ride",
      startTime: new Date(),
      endTime: new Date(),
      totalSeats: 4,
      currentTakenSeats: 0,
      isClosed: false,
    },
  });

  console.log("Seed data added.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
