// yideshare/components/ride-card/profile-ride-card.tsx
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Ride, User, RideRequest } from "@prisma/client";
// import { X, Check, MessageSquare } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
/* -------------------------------------------------------------------------- */
/*  props                                                                     */
/* -------------------------------------------------------------------------- */

interface ProfileRideCardProps {
  ride: Ride;
  /** all confirmed occupants – optional until you wire the query */
  occupants?: User[];
  /** pending requests – optional until you wire the query */
  initialRequests?: RideRequest[];
}

export default function ProfileRideCard({
  ride,
  occupants = [],
  initialRequests = [],
}: ProfileRideCardProps) {
  const { toast } = useToast();

  /* ---------------------------------------------------------------------- */
  /*  derived                                                               */
  /* ---------------------------------------------------------------------- */

  const cardTitle = `${ride.beginning} → ${ride.destination}`;

  const occupantNames =
    occupants.length > 0
      ? occupants.map((o) => o.name ?? o.netId ?? "Unknown")
      : ["You"];

  const totalSeats = ride.totalSeats;
  const occupantCount = ride.currentTakenSeats;
  const isClosed = ride.isClosed;

  const dateObj = new Date(ride.startTime);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  /* ---------------------------------------------------------------------- */
  /*  local state                                                           */
  /* ---------------------------------------------------------------------- */

  // const [requests, setRequests] = React.useState(initialRequests);

  /* ---------------------------------------------------------------------- */
  /*  handlers                                                              */
  /* ---------------------------------------------------------------------- */

  async function handleCloseListing() {
    try {
      const response = await fetch(`${API_BASE}/api/update-ride/${ride.rideId}`, {
        method: "PATCH",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast({
          title: "Ride Closed",
          description: data.message || `Ride #${ride.rideId} has been closed.`,
        });
        // Optional: refresh page or update UI state to remove ride from list
      } else {
        toast({
          title: "Error",
          description: data.error || `Failed to close ride #${ride.rideId}.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error closing ride:", error);
      toast({
        title: "Network Error",
        description: "Failed to close ride. Please try again.",
        variant: "destructive",
      });
    }
  }

  // function handleRemove() {
  //   toast({
  //     title: "Ride Removed",
  //     description: `You removed ride #${ride.rideId}.`,
  //   });
  // }

  // function handleMessageAll() {
  //   toast({
  //     title: "Message Sent",
  //     description: `You messaged all riders in ride #${ride.rideId}.`,
  //   });
  // }

  /* ---------------------------------------------------------------------- */
  /*  UI                                                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-md cursor-pointer hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="text-base">{cardTitle}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {isClosed ? "Listing closed" : "Active"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Date:</strong> {month}/{day}/{year} at {hours}:{minutes}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Riders:</strong> {occupantNames.join(", ")} (
              {occupantCount}/{totalSeats} seats)
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Your Ride</DialogTitle>
          <DialogDescription>
            Ride #{ride.rideId} • {cardTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isClosed ? (
            <p className="text-sm text-muted-foreground italic">
              This listing is closed.
            </p>
          ) : (
            <p>This listing is active. You can remove or close it below.</p>
          )}

          {/* ---------------- requests ---------------- */}
          <div>
            <h3 className="text-sm font-semibold">Requests</h3>

            {/* {requests.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No pending requests
              </p>
            ) : (
              <ul className="space-y-2">
                {requests.map((r) => (
                  <li
                    key={`${r.receiverNetId}-${r.senderNetId}-${r.rideId}`}
                    className="flex items-center justify-between bg-muted/20 p-2 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {r.senderNetId ?? "Unknown sender"}
                      </p>
                      <p className="text-xs italic text-muted-foreground">
                        {r.payload}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )} */}
          </div>

          {/* ---------------- actions ---------------- */}
          <div className="flex flex-wrap gap-2">
            {!isClosed && (
              <Button variant="destructive" onClick={handleCloseListing}>
                Close Listing
              </Button>
            )}
            {/* <Button variant="outline" onClick={handleRemove}>
              Remove Ride
            </Button> */}
            {/* <Button variant="outline" onClick={handleMessageAll}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Riders
            </Button> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
