// app/feed/page.tsx

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { LogoutButton } from "@/components/logout-button"
import FeedClient from "@/app/feed/feed-client"

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function Home() {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")

  if(!userCookie) {
    return <div>Please log in to view your rides.</div>
  }

  const { netID } = JSON.parse(userCookie.value)

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: netID },
    select: { rideId: true }
  })
  const bookmarkedRideIDs = bookmarks.map(b => b.rideId)
  
  const fetchedRides = await prisma.ride.findMany({
    take: 6,
    where: {
      isClosed: false,
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
              <LogoutButton />
            </div>
          </div>
          <TopBar />
        </header>
        <FeedClient 
          initialRides={fetchedRides}
          bookmarkedRideIDs={bookmarkedRideIDs} 
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
