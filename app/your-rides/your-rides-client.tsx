"use client";

import { Separator } from "@/components/ui/separator";
import ProfileRideCard from "@/components/ride-card/profile-ride-card";
import { TopNavButtons } from "@/components/top-nav-buttons";
import { Ride } from "@prisma/client";

interface YourRidesClientProps {
  ownedRides: Ride[];
}

export default function YourRidesClient({ ownedRides }: YourRidesClientProps) {
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

      <div className="flex flex-1 flex-col gap-4 p-4">
        <Separator />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ownedRides
            .map((ride) => (
              <ProfileRideCard key={ride.rideId} ride={ride} />
            ))}
        </div>
      </div>
    </div>
  );
}
