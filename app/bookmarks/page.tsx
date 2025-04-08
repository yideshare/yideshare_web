// app/bookmarks/page.tsx

import React from "react";

import { cookies } from "next/headers";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import FeedRideCard from "@/components/ride-card/feed-ride-card";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { getUserNetIdFromCookies } from "@/lib/utils/user";
import { findBookmarkedRides } from "@/lib/utils/ride";

export default async function BookmarkPage() {
  // get user cookies
  const cookieStore = await cookies();
  const netId = getUserNetIdFromCookies(cookieStore);

  // if no user cookies were found
  if (netId === null) {
    return <div>Please log in to view your rides.</div>;
  }

  // fetch bookmarked rides for the authenticated user
  const bookmarks = await findBookmarkedRides(netId);

  // extract the rides from the prisma query
  const bookmarkedRides = bookmarks.map((b) => b.ride);

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
            {bookmarkedRides.map((ride) => (
              <FeedRideCard
                key={ride.rideId}
                ride={ride}
                isBookmarkedInitial={true}
              />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
