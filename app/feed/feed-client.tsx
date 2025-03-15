"use client";

import * as React from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import FeedRideCard from "@/components/ride-card/feed-ride-card";

import { Ride } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { FeedClientProps } from "@/app/interface/main";

export default function FeedClient({
  rides,
  bookmarkedRideIds,
}: FeedClientProps) {
  const [localRides, setRides] = React.useState<Ride[]>(rides);
  const [sortBy, setSortBy] = React.useState("recent");

  // sort localRides in state whenever "sortBy" changes.
  React.useEffect(() => {
    const sorted = [...localRides];
    if (sortBy === "recent") {
      sorted.sort((a, b) => +new Date(b.startTime) - +new Date(a.startTime));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => +new Date(a.startTime) - +new Date(b.startTime));
    } else if (sortBy === "alphabetical") {
      sorted.sort((a, b) =>
        (a.beginning ?? "").localeCompare(b.beginning ?? "")
      );
    }
    // additional sort conditions (e.g. popularity) can be added here.
    setRides(sorted);
  }, [sortBy]);

  return (
    <div className="relative flex flex-1 flex-col p-4">
      {/* sort-by control positioned absolutely in the top right (without a background box) */}
      <div className="absolute top-7 right-4 flex items-center text-gray-500 text-sm gap-1">
        <span>Sort by:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-8 w-[150px]">
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

      {/* separator (if desired) – note that this does not affect the positioning of the ride cards */}
      <Separator className="mb-4" />

      {/* ride card list */}
      <div className="pt-16 flex justify-center">
        <div className="flex flex-col gap-4 center max-w-[1200px] w-full">
          {localRides.length > 0 ? (
            localRides.map((ride) => (
              <FeedRideCard
                key={ride.rideId}
                ride={ride}
                isBookmarkedInitial={bookmarkedRideIds.includes(ride.rideId)} // check if ride is bookmarked
              />
            ))
          ) : (
            <p>No rides available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
