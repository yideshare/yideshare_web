// app/feed/page.tsx

import { prisma } from "@/lib/prisma"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import FeedClient from "@/app/feed-client"
import { TopBar } from "@/components/top-bar"
import Link from "next/link"

export default async function Home() {
  const fetchedRides = await prisma.ride.findMany({
    take: 5,
    orderBy: { startTime: "desc" },
    where: { 
      isClosed: false,
      startTime: { gte: new Date() },
    }
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
            <div className="ml-auto">
              <Link
                href="/api/auth/logout"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Logout
              </Link>
            </div>
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
