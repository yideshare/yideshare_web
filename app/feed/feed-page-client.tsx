"use client";

import Link from 'next/link'
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { TopBar } from "@/components/top-bar";
import { TopNavButtons } from "@/components/top-nav-buttons";
import { Ride } from "@prisma/client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import FeedRideCard from "@/components/ride-card/feed-ride-card";

import { FeedPageClientProps } from "@/app/interface/main";

export default function FeedPageClient({
  initialRides,
  bookmarkedRideIds,
}: FeedPageClientProps) {
  const [rides, setRides] = React.useState<Ride[]>(initialRides);
  const [sortBy, setSortBy] = React.useState("recent");
  
    React.useEffect(() => {
      const sorted = [...rides];
      if (sortBy === "recent") {
        sorted.sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime));
      } else if (sortBy === "oldest") {
        sorted.sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime));
      } else if (sortBy === "alphabetical") {
        sorted.sort((a, b) =>
          (a.beginning ?? "").localeCompare(b.beginning ?? "")
        );
      }
      setRides(sorted);
    }, [sortBy]);

  return (
    <div className="bg-white min-h-screen">
        {/* header strip */}
      <header className="bg-background py-8">
        <div className="flex h-16 items-center justify-between px-8 mb-8">
          <div className="flex items-center gap-16">
            <Link href="/feed">
              <h1 className="text-3xl font-righteous text-[#397060] tracking-wide hover:text-[#2d5848] transition-colors">
              Yideshare
            </h1>
            </Link>
            <Link
              href="https://docs.google.com/forms/u/1/d/1h6MQYNtshyOujGAfsj2R1mqOdoNTy8YoY0MUdGc1-yo/edit?usp=drive_web"
              className="rounded-full bg-[#397060] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d5848] transition-colors"
            >
              Feedback
            </Link>
          </div>
          <TopNavButtons />
          </div>

          {/* live‑filtering search bar */}
        <div className="px-8">
          <TopBar onResults={setRides} rides={rides} />
        </div>
        </header>

        {/* feed list */}
        <div className="relative flex flex-1 flex-col p-6 bg-white">
        <div className="absolute top-9 right-6 flex items-center text-sm text-black gap-1">
        <span>Sort by:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-8 w-[150px] rounded-lgx bg-white text-black">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
          </SelectContent>
        </Select>
        </div>

        <Separator className="mb-4" />

        <div className="pt-16 flex justify-center">
          <div className="flex flex-col gap-6 max-w-[1200px] w-full">
            {rides.length ? (
              rides.map((ride) => (
                <FeedRideCard
                  key={ride.rideId}
                  ride={ride}
                  isBookmarkedInitial={bookmarkedRideIds.includes(ride.rideId)}
                />
              ))
            ) : (
              <p className="text-black">No rides available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
