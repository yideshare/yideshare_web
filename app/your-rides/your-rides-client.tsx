"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { TopNavButtons } from "@/components/top-nav-buttons";
import Link from "next/link";
import { Ride } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import FeedRideCard from "@/components/feed-ride-card";
import EditRideDialog from "@/components/EditRideDialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface YourRidesClientProps {
  ownedRides: Ride[];
}
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export default function YourRidesClient({ ownedRides }: YourRidesClientProps) {
  const { toast } = useToast();
  const [sortBy, setSortBy] = React.useState<string>("recent");
  const [localRides, setLocalRides] = React.useState<Ride[]>(ownedRides);
  const [editingRide, setEditingRide] = React.useState<Ride | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  // Handle sorting
  React.useEffect(() => {
    const sortedRides = [...localRides];
    switch (sortBy) {
      case "recent":
        sortedRides.sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        break;
      case "oldest":
        sortedRides.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        break;
      case "alphabetical":
        sortedRides.sort((a, b) => a.beginning.localeCompare(b.beginning));
        break;
    }
    setLocalRides(sortedRides);
  }, [sortBy]);

  const handleDeleteRide = async (rideId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/rides/deleteRide?rideId=${rideId}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete ride");
      }
  
      // Remove the deleted ride from the state
      setLocalRides(localRides.filter((ride) => ride.rideId !== rideId));
  
      // Show success toast
      toast({
        title: "Ride Deleted",
        description: "Your ride has been successfully deleted.",
      });
    } catch (error) {
      // Handle errors and show toast with error message
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete ride. Please try again.",
        variant: "destructive",
      });
    }
  };  

  const handleEditRide = async (updatedRide: Partial<Ride>) => {
    if (!editingRide) return;
  
    try {
      const res = await fetch(`${API_BASE}/api/rides/updateRide?rideId=${editingRide.rideId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRide),
      });
  
      if (!res.ok) throw new Error("Failed to update ride");
  
      const updatedRideData = await res.json();
  
      // Update the state with the new ride details
      setLocalRides(
        localRides.map((ride) =>
          ride.rideId === editingRide.rideId ? updatedRideData : ride
        )
      );
  
      // Show success toast
      toast({
        title: "Ride Updated",
        description: "Your ride has been successfully updated.",
      });
    } catch (error) {
      console.log(error);
      // Handle error and show error toast
      toast({
        title: "Error",
        description: "Failed to update ride. Please try again.",
        variant: "destructive",
      });
    }
  }; 

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
              href="https://docs.google.com/forms/d/e/1FAIpQLSeVXC0N53MouFwl23_1aJe19EkatPym_VwIXv2uzm3W4DuhkA/viewform?usp=dialog"
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
                <div
                  className="relative"
                  onClick={() => {
                    setEditingRide(ride);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRide(ride.rideId);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <FeedRideCard
                    ride={ride}
                    isBookmarkedInitial={false}
                    showDialog={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingRide && (
        <EditRideDialog
          open={isEditDialogOpen}
          setOpen={setIsEditDialogOpen}
          ride={editingRide}
          onSave={handleEditRide}
        />
      )}
    </div>
  );
}
