// yideshare/app/your-rides/page.tsx
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import YourRidesClient from "./your-rides-client";
import { findBookmarkedRides } from "@/lib/ride";

export default async function DashboardPage() {
  /* -------------------------------------------------------------------- */
  /*  auth                                                                */
  /* -------------------------------------------------------------------- */

  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    return <div>Please log in to view your rides.</div>;
  }

  const { netId } = JSON.parse(userCookie.value);

  /* -------------------------------------------------------------------- */
  /*  data                                                                */
  /* -------------------------------------------------------------------- */

  const ownedRides = await prisma.ride.findMany({
    take: 6,
    where: {
      ownerNetId: netId,
      isClosed: false,
    },
    orderBy: { startTime: "desc" },
  });

  // Fetch bookmarks and extract ride IDs
  const bookmarks = await findBookmarkedRides(netId);
  const bookmarkedRideIds = bookmarks.map((b) => b.ride.rideId);

  return <YourRidesClient ownedRides={ownedRides} bookmarkedRideIds={bookmarkedRideIds} />;
}
