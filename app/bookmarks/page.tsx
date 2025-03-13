import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import FeedRideCard from "@/components/ride-card/feed-ride-card";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function BookmarkPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (!userCookie) {
    return <div>Please log in to view your rides.</div>;
  }

  const { netId } = JSON.parse(userCookie.value);

  // Query bookmarks for the authenticated user and include the related ride
  const bookmarks = await prisma.bookmark.findMany({
    where: { netId: netId },
    include: { ride: true },
  });

  // Extract the rides from bookmarks
  const bookmarkedRides = bookmarks.map(b => b.ride);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-bold text-xl">My Bookmarks</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <Separator />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookmarkedRides.map((ride) => (
              <FeedRideCard 
                key={ride.id}
                ride={ride}
                isBookmarkedInitial={true} />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
