"use client";

import * as React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import FeedClient from "@/app/feed/feed-client";
import { TopBar } from "@/components/top-bar";
import { Ride } from "@prisma/client";

interface FeedPageClientProps {
  initialRides: Ride[];
  bookmarkedRideIds: string[];
}

export default function FeedPageClient({
  initialRides,
  bookmarkedRideIds,
}: FeedPageClientProps) {
  const [rides, setRides] = React.useState<Ride[]>(initialRides);

  return (
    <SidebarProvider>
      {/* side nav */}
      <AppSidebar />

      {/* main column */}
      <SidebarInset className="bg-white min-h-screen">
        {/* header strip */}
        <header className="bg-background">
          <div className="flex h-16 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-righteous text-[#397060] tracking-wide">
              Yideshare
            </h1>
          </div>

          {/* live‑filtering search bar */}
          <TopBar onResults={setRides} />
        </header>

        {/* feed list */}
        <FeedClient rides={rides} bookmarkedRideIds={bookmarkedRideIds} />
      </SidebarInset>
    </SidebarProvider>
  );
}
