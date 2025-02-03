// app/page.tsx

import { prisma } from "@/lib/db"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import FeedClient from "@/app/feed-client"
import { TopBar } from "@/app/components/top-bar"

export default async function Home() {
  // Example: fetch 5 rides from the DB, sorting by recency.
  const fetchedRides = await prisma.ride.findMany({
    take: 5,
    orderBy: { dateTime: "desc" },
  })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="">
          <div className="flex h-16 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="font-bold text-xl">Yideshare</h1>
          </div>
          {/* Render the TopBar (with search fields, date/time picker, and modal) */}
          <TopBar />
        </header>

        {/* The main feed area */}
        <FeedClient initialRides={fetchedRides} />
      </SidebarInset>
    </SidebarProvider>
  )
}
