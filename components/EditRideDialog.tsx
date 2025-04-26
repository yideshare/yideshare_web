"use client";

import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TimeSelect } from "@/components/ui/time-select";
import { Ride } from "@prisma/client";

interface EditRideDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  ride: Ride;
  onSave: (updatedRide: Partial<Ride>) => Promise<void>;
}

export default function EditRideDialog({
  open,
  setOpen,
  ride,
  onSave,
}: EditRideDialogProps) {
  const [from, setFrom] = React.useState(ride.beginning);
  const [to, setTo] = React.useState(ride.destination);
  const [startTime, setStartTime] = React.useState(ride.startTime.toLocaleTimeString());
  const [endTime, setEndTime] = React.useState(ride.endTime.toLocaleTimeString());
  const [description, setDescription] = React.useState(ride.description || "");
  const [totalSeats, setTotalSeats] = React.useState(ride.totalSeats);

  const ready = from && to && startTime && endTime;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRide = {
      beginning: from,
      destination: to,
      startTime: new Date(ride.startTime.toDateString() + " " + startTime),
      endTime: new Date(ride.endTime.toDateString() + " " + endTime),
      description,
      totalSeats,
    };
    await onSave(updatedRide);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span />
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle>Edit Ride</DialogTitle>
          <DialogDescription>
            Update the details of your ride listing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* route */}
          <div className="space-y-2">
            <Label htmlFor="from">Leaving from</Label>
            <Input
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">Heading to</Label>
            <Input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>

          <TimeSelect
            label="Start time"
            value={startTime}
            onChange={setStartTime}
            className="mt-2 sm:mt-0"
          />

          <TimeSelect
            label="End time"
            value={endTime}
            onChange={setEndTime}
            className="mt-2 sm:mt-0"
          />

          {/* seats */}
          <div className="space-y-2">
            <Label htmlFor="seats">
              Number of Open Seats <span className="text-red-500">*</span>
            </Label>
            <Input
              id="seats"
              type="number"
              min="1"
              max="10"
              value={totalSeats}
              onChange={(e) => setTotalSeats(parseInt(e.target.value))}
              required
            />
          </div>

          {/* description */}
          <div className="space-y-2">
            <Label htmlFor="desc">
              Description{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I have two suitcases, planning to order an UberXL..."
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={!ready}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 