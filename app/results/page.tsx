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

interface PageProps {
    searchParams: {
        from?: string;
        to?: string;
        date?: string;
        startTime?: string;
        endTime?: string;
    }
}

export default async function Results( {searchParams} : PageProps )
{
    const from = searchParams.from ? decodeURIComponent(searchParams.from) : ""
    const to = searchParams.to ? decodeURIComponent(searchParams.to) : ""
    const date = searchParams.date ? decodeURIComponent(searchParams.date) : ""
    const startTime = searchParams.startTime ? decodeURIComponent(searchParams.startTime) : ""
    const endTime = searchParams.endTime ? decodeURIComponent(searchParams.endTime) : ""

    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")

    if(!userCookie) {
    return <div>Please log in to view your rides.</div>
    }

    const { netId } = JSON.parse(userCookie.value)

    const bookmarks = await prisma.bookmark.findMany({
        where: { netId: netId },
        select: { rideId: true }
      })
    
    const bookmarkedRideIds = bookmarks.map(b => b.rideId)

    const rides = await prisma.ride.findMany({
        where: {
          beginning: from,
          destination: to,
          isClosed: false, // Ensure the ride is not closed
        },
    });

    console.log(rides)

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
            initialRides={rides}
            bookmarkedRideIds={bookmarkedRideIds} 
          />
        </SidebarInset>
      </SidebarProvider>
    );
}