"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bookmark } from "lucide-react";

import {
  Card,
  // CardContent,
  // CardHeader,
} from "@/components/ui/card";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogDescription,
  // DialogFooter,
} from "@/components/ui/dialog";

// import {
//   Tooltip,
//   TooltipProvider,
//   TooltipContent,
// } from "@/components/ui/tooltip";

// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";

import { FeedRideCardProps } from "@/app/interface/main";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";
export default function FeedRideCard({
  ride,
  isBookmarkedInitial,
  showDialog = true,
  hideBookmark = false, // add default
}: FeedRideCardProps & { hideBookmark?: boolean }) {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = React.useState(isBookmarkedInitial);
  // const [message, setMessage] = React.useState("Hi, is this ride still available...");
  // const [requestSeat, setRequestSeat] = React.useState(false);

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, "");
    // Format as (xxx)-xxx-xxxx
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]})-${match[2]}-${match[3]}`;
    }
    return phone; // Return original if doesn't match expected format
  };

  /* ------------ helpers ------------ */
  // const postedAgo = "1d ago";          // TODO real calc
  const ownerName = ride.ownerName ?? "Driver";
  const totalSeats = ride.totalSeats;
  // const occupantCount = ride.currentTakenSeats;

  const sDate = new Date(ride.startTime);
  const eDate = new Date(ride.endTime);
  const dateLabel = `${sDate.getDate()} ${sDate.toLocaleString("en", {
    month: "short",
  })}`;
  const timeLabel = `${sDate.toLocaleTimeString("en", {
    hour: "numeric",
    minute: "2-digit",
  })} - ${eDate.toLocaleTimeString("en", {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  /* ------------ bookmark ------------ */
  async function handleBookmark() {
    try {
      const res = await fetch(`${API_BASE}/api/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId: ride.rideId }),
      });
      const data = await res.json();
      setIsBookmarked(data.bookmarked);
      toast({
        title: data.bookmarked ? "Ride Bookmarked" : "Bookmark Removed",
      });
    } catch {
      toast({ title: "Error", description: "Could not update bookmark." });
    }
  }

  /* ------------ message handling ------------ */
  // const handleMessageChange = (e) => {
  //   setMessage(e.target.value);
  // };

  // const handleSendMessage = () => {
  //   // Handle sending message logic here
  //   toast({
  //     title: "Message Sent",
  //     description: requestSeat ? "Your seat request has been sent" : "Your message has been sent"
  //   });
  // };

  // const handleAddToCalendar = () => {
  //   // Handle calendar logic here
  //   toast({
  //     title: "Added to Calendar",
  //     description: "This ride has been added to your calendar"
  //   });
  // };

  /* ------------ UI ------------ */
  const cardContent = (
    <Card className="rounded-2xl border border-border bg-white px-6 py-4 shadow-card hover:shadow-cardHover cursor-pointer">
      <div className="grid grid-cols-4 gap-1">
        <div>
          <p className="text-lg font-medium text-black mb-1">Leaving from</p>
          <p className="text-2xl font-semibold text-black">{ride.beginning}</p>
        </div>

        <div>
          <p className="text-lg font-medium text-black mb-1">Going to</p>
          <p className="text-2xl font-semibold text-black">
            {ride.destination}
          </p>
        </div>

        <div>
          <p className="text-lg font-medium text-black mb-1">Date</p>
          <p className="text-2xl font-semibold text-black">{dateLabel}</p>
        </div>

        <div>
          <p className="text-lg font-medium text-black mb-1">
            Departure Time Range (EST)
          </p>
          <p className="text-2xl font-semibold text-black">{timeLabel}</p>
        </div>
      </div>

      <div className="h-px bg-border my-4" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-muted text-2xl font-semibold text-black">
            {ownerName[0]}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-black">
            <span className="text-xl">{ownerName}</span>
            {/* <span className="text-xl text-black">
              {ride.owner.email ?? "driver@yale.edu"}
            </span> */}
            <span className="text-xl text-black">
              {ride.ownerPhone
                ? formatPhoneNumber(ride.ownerPhone)
                : "No phone provided"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <span className="text-lg text-black">{postedAgo}</span> */}
          {!hideBookmark && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleBookmark();
              }}
            >
              <Bookmark
                className="h-5 w-5 text-primary"
                style={{ fill: isBookmarked ? "currentColor" : "none" }}
              />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  if (!showDialog) {
    return cardContent;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{cardContent}</DialogTrigger>

      {/* -------- Dialog -------- */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-black">
            Ride Details
          </DialogTitle>
          <div className="mt-4">
            <div className="flex items-center text-lg text-black">
              <span>Posted by: {ride.ownerName || "Raymond Hou"}</span>
              <span className="mx-2">•</span>
              <span>{totalSeats} seats available</span>
            </div>
            {ride.ownerPhone && (
              <div className="text-lg text-black mt-1">
                Phone: {formatPhoneNumber(ride.ownerPhone)}
              </div>
            )}
            <div className="text-lg text-black mt-1">
              Description:{" "}
              {ride.description
                ? ride.description
                : "No additional information provided"}
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <label className="text-sm font-bold text-black">Date</label>
              <p className="text-lg font-medium text-black">{dateLabel}</p>
            </div>
            <div className="flex-1">
              <label className="text-sm font-bold text-black">
                Departure Time Range (EST)
              </label>
              <p className="text-lg font-medium text-black">{timeLabel}</p>
            </div>
          </div>
        </DialogHeader>

        {/* <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-black">Message the driver:</h3>
            <div className="flex items-center gap-2">
              <Checkbox 
                id="request-seat" 
                checked={requestSeat} 
                onCheckedChange={setRequestSeat}
              />
              <label htmlFor="request-seat" className="text-base cursor-pointer text-black">
                Request a seat
              </label>
            </div>
          </div>
          
          <Textarea 
            value={message} 
            onChange={handleMessageChange} 
            placeholder="Type your message here..." 
            className="min-h-24"
          />
        </div> */}

        {/* <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleAddToCalendar}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Add to Calendar
          </Button>
          <Button onClick={handleSendMessage}>
            Send
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
