"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Bookmark } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FeedRideCardProps } from "@/app/interface/main";

export default function FeedRideCard({
  ride,
  occupants = [],
  isBookmarkedInitial,
}: FeedRideCardProps) {
  const { toast } = useToast();

  const totalSeats = ride.totalSeats;
  const occupantCount = ride.currentTakenSeats;
  const postedAgo = ""; // TODO: Compute how long ago it was posted
  const ownerName = ride.ownerName || "Raymond Hou";
  const occupantNames = occupants.map((o) => o.name).join(", ") || "Unknown";

  // const [requestSeat, setRequestSeat] = React.useState(false)
  // const [message, setMessage] = React.useState("")

  // Local state for the bookmark
  const [isBookmarked, setIsBookmarked] = React.useState(isBookmarkedInitial);

  // Format date/time from ride.startTime
  const dateObj = new Date(ride.startTime);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const hours_start = dateObj.getHours();
  const minutes_start = String(dateObj.getMinutes()).padStart(2, "0");

  const dateObjEnd = new Date(ride.endTime);
  const hours_end = dateObj.getHours();
  const minutes_end = String(dateObj.getMinutes()).padStart(2, "0");

  // Handle toggling the bookmark state.
  async function handleBookmark() {
    try {
      const response = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId: ride.rideId }),
      });
      const data = await response.json();

      // Update local state with the new bookmark status.
      setIsBookmarked(data.bookmarked);

      toast({
        title: data.bookmarked ? "Ride Bookmarked" : "Bookmark Removed",
        description: `Ride #${ride.rideId} was ${
          data.bookmarked ? "bookmarked" : "removed from bookmarks"
        }.`,
      });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "Could not update bookmark status.",
      });
    }
  }

  // function handleAddToCalendar() {
  //   toast({
  //     title: "Added to Calendar",
  //     description: `Ride #${ride.rideId} was added to your calendar!`,
  //   })
  // }

  // function handleSend() {
  //   toast({
  //     title: "Message Sent",
  //     description: `Message sent to ${ownerName}. (Request seat: ${requestSeat ? "Yes" : "No"})`,
  //   })
  //   setMessage("")
  // }
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timeZoneAbbreviation = new Date()
  .toLocaleTimeString('en', { timeZoneName: 'short' })
  .split(' ')[2];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Feed card UI */}
        <Card className="w-full relative shadow-md cursor-pointer transition hover:shadow-lg">
          <span className="absolute top-2 right-2 text-xs text-muted-foreground">
            {postedAgo}
          </span>
          <CardHeader className="flex flex-col gap-1">
            <CardTitle className="text-base">
              {ride.beginning} → {ride.destination}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Posted by: {ownerName} • {occupantCount}/{totalSeats} seats filled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Date:</strong> {month}/{day}/{year}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Start Time:</strong> {hours_start}:{minutes_start} {timeZoneAbbreviation}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>End Time:</strong> {hours_end}:{minutes_end} {timeZoneAbbreviation}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Ride Details</span>
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              <Bookmark
                className="h-5 w-5"
                style={{ fill: isBookmarked ? "#2563EB" : "none" }}
              />
            </Button>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-muted-foreground text-sm mt-1">
              <div className="flex items-center gap-2">
                Posted by: <strong>{ownerName}</strong>
                {/* <span>•</span> */}
                <TooltipProvider>
                  <Tooltip>
                    {/* <TooltipTrigger asChild>
                      <span className="underline decoration-dotted cursor-help">
                        {occupantCount}/{totalSeats} seats filled
                      </span>
                    </TooltipTrigger> */}
                    <TooltipContent>
                      <p className="text-sm">{occupantNames}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* <div className="text-sm text-muted-foreground italic">
            “{ride.description ?? "I have two suitcases, might share an UberXL..."}”
          </div> */}

          {/* <div className="flex items-center justify-between">
            <label className="text-sm font-medium mr-2">Message the driver:</label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requestSeat"
                checked={requestSeat}
                onCheckedChange={(v) => setRequestSeat(Boolean(v))}
              />
              <label htmlFor="requestSeat" className="text-sm font-medium">
                Request a seat
              </label>
            </div>
          </div>

          <textarea
            className="w-full border p-2 rounded text-sm"
            rows={3}
            placeholder="Hi, is this ride still available..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          /> */}

          {/* <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleAddToCalendar}>
              Add to Calendar
            </Button>
            <Button variant="secondary" onClick={handleSend}>
              Send
            </Button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
