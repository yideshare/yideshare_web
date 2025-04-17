// yideshare/app/your-rides/page.tsx
import { Separator } from "@/components/ui/separator";
import ProfileRideCard from "@/components/ride-card/profile-ride-card";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { TopNavButtons } from "@/components/top-nav-buttons";

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

  /* -------------------------------------------------------------------- */
  /*  UI                                                                  */
  /* -------------------------------------------------------------------- */

  return (
    <div className="bg-white min-h-screen">
      {/* header strip */}
      <header className="bg-background py-8">
        <div className="flex h-16 items-center justify-between px-8 mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-righteous text-[#397060] tracking-wide">
              Yideshare
            </h1>
          </div>
          <TopNavButtons />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <Separator />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ownedRides.map((ride) => (
            <ProfileRideCard key={ride.rideId} ride={ride} />
          ))}
        </div>
      </div>
    </div>
  );
}
