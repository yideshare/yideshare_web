"use client";

import React from "react";
import FeedRideCard from "@/components/ride-card/feed-ride-card";
import { Separator } from "@/components/ui/separator";
import { TopNavButtons } from "@/components/top-nav-buttons";
import { Ride } from "@prisma/client";

interface BookmarksClientProps {
  bookmarkedRides: Ride[];
}

export default function BookmarksClient({ bookmarkedRides }: BookmarksClientProps) {
  return (
    <div className="bg-white min-h-screen">
      {/* header strip */}
      <header className="bg-background py-8">
        <div className="flex h-16 items-center justify-between px-8 mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-righteous text-[#397060] tracking-wide">
              Yideshare
            </h1>
          </div>
          <TopNavButtons />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 max-w-6xl mx-auto">
        <Separator />
        <div className="flex flex-col items-center gap-4">
          {bookmarkedRides.map((ride) => (
            <div key={ride.rideId} className="w-full max-w-4xl">
              <FeedRideCard
                ride={ride}
                isBookmarkedInitial={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 