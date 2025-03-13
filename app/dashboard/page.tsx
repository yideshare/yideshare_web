import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Ride } from "@prisma/client"
import ProfileRideCard from "@/components/ride-card/profile-ride-card"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

export default async function DashboardPage() {
  // Get the cookie store and retrieve the "user" cookie
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    // Optionally, handle cases where the user isn't logged in
    return <div>Please log in to view your rides.</div>;
  }

  // Parse the cookie to get the netId. Adjust the property name if needed.
  const { netId } = JSON.parse(userCookie.value);

  // Use the netId from the cookie to filter rides owned by the user.
  const ownedRides = await prisma.ride.findMany({
    take: 6,
    where: {
      ownerNetId: netId,  
      isClosed: false,
    },
  });

  console.log(ownedRides);

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
              <ProfileRideCard key={ride.id} {...ride} />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
