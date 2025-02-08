// app/dashboard/profile-page.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import ProfileRideCard from "@/components/ride-card/profile-ride-card"
import type { Ride } from "@/app/types/main"

// Suppose you fetch from DB or mock
// This is a server component if you omit "use client"
export default async function ProfilePage() {
  // Example dummy rides
  const myRides: Ride[] = [
    {
      id: "abc123",
      title: "Yale → Hartford",
      dateTime: new Date("2025-02-05T09:00:00"),
      occupantNames: ["You (Raymond Hou)", "Lena Qian"],
      totalSeats: 4,
      isClosed: false,
    },
    {
      id: "xyz789",
      title: "New Haven → Boston",
      dateTime: new Date("2025-02-10T14:30:00"),
      occupantNames: ["You (Raymond Hou)"],
      totalSeats: 3,
      isClosed: false,
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b">
          <h1 className="font-bold text-xl">Your Rides</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myRides.map((ride) => (
              <ProfileRideCard key={ride.id} {...ride} />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
