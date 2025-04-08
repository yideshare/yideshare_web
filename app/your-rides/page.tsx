// yideshare/app/your-rides/page.tsx
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import ProfileRideCard from "@/components/ride-card/profile-ride-card";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-bold text-xl">My Rides</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ownedRides.map((ride) => (
              <ProfileRideCard key={ride.rideId} ride={ride} />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
