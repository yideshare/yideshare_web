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
import { useState } from "react";

const formatTimeForDisplay = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hour12 = ((hours + 11) % 12) + 1;
  const suffix = hours < 12 ? "AM" : "PM";
  return `${hour12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};

const formatTimeForServer = (timeStr: string, baseDate: Date) => {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(baseDate);
  const hour24 = period === "PM" ? (hours % 12) + 12 : hours % 12;
  date.setHours(hour24, minutes);
  return date;
};

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
  const [formData, setFormData] = useState({
    beginning: ride.beginning,
    destination: ride.destination,
    description: ride.description || "",
    startTime: ride.startTime ? formatTimeForDisplay(new Date(ride.startTime)) : "12:00 AM",
    endTime: ride.endTime ? formatTimeForDisplay(new Date(ride.endTime)) : "12:00 AM",
    totalSeats: ride.totalSeats,
    organizerName: ride.ownerName || "",
    phoneNumber: ride.ownerPhone || "",
  });

  const ready = formData.beginning && formData.destination && formData.startTime && formData.endTime && formData.phoneNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRide = {
      beginning: formData.beginning,
      destination: formData.destination,
      startTime: formatTimeForServer(formData.startTime, new Date(ride.startTime)),
      endTime: formatTimeForServer(formData.endTime, new Date(ride.endTime)),
      description: formData.description,
      totalSeats: formData.totalSeats,
      ownerName: formData.organizerName,
      ownerPhone: formData.phoneNumber,
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
          {/* organiser + phone */}
          <div className="space-y-2">
            <Label htmlFor="organizer">
              Organizer name{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="organizer"
              value={formData.organizerName}
              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="(123) 456-7890"
              required
            />
          </div>

          {/* route */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">Leaving from</Label>
              <Input
                id="from"
                value={formData.beginning}
                onChange={(e) => setFormData({ ...formData, beginning: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">Heading to</Label>
              <Input
                id="to"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-4">
              <TimeSelect
                label="Start time"
                value={formData.startTime}
                onChange={(timeStr) => setFormData({ ...formData, startTime: timeStr })}
                className="flex-1"
              />

              <TimeSelect
                label="End time"
                value={formData.endTime}
                onChange={(timeStr) => setFormData({ ...formData, endTime: timeStr })}
                className="flex-1"
              />
            </div>
          </div>

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
              value={formData.totalSeats}
              onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) })}
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
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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