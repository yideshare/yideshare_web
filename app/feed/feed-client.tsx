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
    setRides(sorted);
  }, [sortBy]);

  return (
    <div className="relative flex flex-1 flex-col p-6">
      <div className="absolute top-9 right-6 flex items-center text-sm text-muted-foreground gap-1">
        <span>Sort by:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-8 w-[150px] rounded-lgx bg-secondary text-foreground">
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
          {localRides.length ? (
            localRides.map((ride) => (
              <FeedRideCard
                key={ride.rideId}
                ride={ride}
                isBookmarkedInitial={bookmarkedRideIds.includes(ride.rideId)}
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
