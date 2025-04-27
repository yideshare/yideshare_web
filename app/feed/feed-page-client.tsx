"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import FeedClient from "@/app/feed/feed-client";
import { TopBar } from "@/components/top-bar";
import { TopNavButtons } from "@/components/top-nav-buttons";
import { Ride } from "@prisma/client";
import Link from "next/link";

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
        <FeedClient rides={rides} bookmarkedRideIds={bookmarkedRideIds} />
    </div>
  );
}
