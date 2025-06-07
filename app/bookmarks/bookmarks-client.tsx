"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { TopNavButtons } from "@/components/top-nav-buttons";
import { Ride } from "@prisma/client";
import Link from "next/link";
// import { MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeedRideCard from "@/components/feed-ride-card";

interface BookmarksClientProps {
  bookmarkedRides: Ride[];
}

export default function BookmarksClient({
  bookmarkedRides,
}: BookmarksClientProps) {
  const [sortBy, setSortBy] = React.useState<string>("recent");
  const [localRides, setLocalRides] = React.useState<Ride[]>([]);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    setLocalRides(bookmarkedRides);
  }, [bookmarkedRides]);

  // Handle sorting
  React.useEffect(() => {
    if (!isMounted) return;
    
    const sortedRides = [...bookmarkedRides];
    switch (sortBy) {
      case "recent":
        sortedRides.sort(
          (a, b) => {
            const dateA = new Date(a.startTime).getTime();
            const dateB = new Date(b.startTime).getTime();
            return dateB - dateA;
          }
        );
        break;
      case "oldest":
        sortedRides.sort(
          (a, b) => {
            const dateA = new Date(a.startTime).getTime();
            const dateB = new Date(b.startTime).getTime();
            return dateA - dateB;
          }
        );
        break;
      case "alphabetical":
        sortedRides.sort((a, b) => (a.beginning ?? "").localeCompare(b.beginning ?? ""));
        break;
    }
    setLocalRides(sortedRides);
  }, [sortBy, bookmarkedRides, isMounted]);

  if (!isMounted) {
    return null;
  }

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
      </header>

      <div className="relative flex flex-1 flex-col p-6 bg-white">
        <Separator className="mb-4" />
        <div className="absolute top-9 right-6 flex items-center text-sm text-black gap-1">
          <span>Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 w-[150px] rounded-lg bg-white text-black">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-16 flex justify-center">
          <div className="flex flex-col gap-6 max-w-[1200px] w-full">
            {localRides.map((ride) => (
              <div key={ride.rideId} className="w-full">
                <FeedRideCard ride={ride} isBookmarkedInitial={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

