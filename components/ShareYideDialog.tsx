// yideshare/components/ShareYideDialog.tsx
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

/* -------------------------------------------------------------------------- */
/*  props                                                                     */
/* -------------------------------------------------------------------------- */
interface ShareYideDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;

  /* data already present in the top bar – keep them in sync */
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  startTime: string;
  setStartTime: (v: string) => void;
  endTime: string;
  setEndTime: (v: string) => void;

  /* dialog‑only fields */
  organizerName: string;
  setOrganizerName: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  additionalPassengers: number;
  setAdditionalPassengers: (v: number) => void;
  description: string;
  setDescription: (v: string) => void;

  handleShareYide: (e: React.FormEvent) => Promise<void>;
}

export default function ShareYideDialog({
  open,
  setOpen,

  from,
  setFrom,
  to,
  setTo,
  startTime,
  setStartTime,
  endTime,
  setEndTime,

  organizerName,
  setOrganizerName,
  phoneNumber,
  setPhoneNumber,
  additionalPassengers,
  setAdditionalPassengers,
  description,
  setDescription,

  handleShareYide,
}: ShareYideDialogProps) {
  const ready = from && to && startTime && endTime;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span />
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl bg-white">
        <DialogHeader>
          <DialogTitle>Share a Yide</DialogTitle>
          <DialogDescription>
            Fill out the details below to create a new ride listing.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            handleShareYide(e);
            setOpen(false);
          }}
          className="space-y-4"
        >
          {/* organiser + phone */}
          <div className="space-y-2">
            <Label htmlFor="organizer">
              Organizer name{" "}
              <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="organizer"
              value={organizerName}
              onChange={(e) => setOrganizerName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
              label="Earliest departure"
              value={startTime}
              onChange={setStartTime}
              className="mt-2 sm:mt-0"
            />

            <TimeSelect
              label="Latest departure"
              value={endTime}
              onChange={setEndTime}
              className="mt-2 sm:mt-0"
            />
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
              value={additionalPassengers}
              onChange={(e) => setAdditionalPassengers(parseInt(e.target.value))}
              required
            />
          </div>

          {/* description */}
          <div className="space-y-2">
            <Label htmlFor="desc">
              Description{" "}
              <span>(optional)</span>
            </Label>
            <Textarea
              className="bg-white"
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I have two suitcases, planning to order an UberXL..."
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={!ready}>
              Post Yide
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
