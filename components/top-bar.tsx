"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function TopBar() {
  // Quick search fields
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [date, setDate] = useState(new Date()); // Default to today's date
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [mounted, setMounted] = useState(false); // Ensure it renders only on the client
  useEffect(() => {
    setMounted(true); // Mark component as mounted
    setDate(new Date()); // Ensure date is only set on the client
  }, []);

  // “Share a Yide” form fields
  const [organizerName, setOrganizerName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [additionalPassengers, setAdditionalPassengers] = React.useState(0);
  const [description, setDescription] = React.useState("");

  // Modal open state
  const [open, setOpen] = React.useState(false);

  async function handleShareYide(e: React.FormEvent) {
    e.preventDefault();

    const selectedDate = date ? new Date(date) : new Date(); // Use current date if undefined

    // Split startTime and endTime strings into hours and minutes
    const [startHours, startMinutes] = startTime.split(":").map(Number); // e.g., "10:00" -> [10, 0]
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    // Create valid Date objects by combining the selected date with the start and end times
    const startDate = new Date(selectedDate); // Use the selected date
    const endDate = new Date(selectedDate);

    // Set the correct hours and minutes for start and end times
    startDate.setHours(startHours, startMinutes, 0, 0); // Set start time on the selected date
    endDate.setHours(endHours, endMinutes, 0, 0);

    // Convert to ISO string format for Prisma
    const formattedStartTime = startDate.toISOString();
    const formattedEndTime = endDate.toISOString();

    const rideData = {
      ownerName: organizerName,
      ownerPhone: phoneNumber,
      beginning: from,
      destination: to,
      description,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      totalSeats: additionalPassengers + 1,
    };

    console.log("Posting new ride:", rideData);
    try {
      const response = await fetch("/api/ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rideData),
      });

      if (!response.ok) {
        throw new Error("Failed to create ride");
      }

      const data = await response.json();
      console.log("Ride created successfully:", data);

      setOpen(false); // Close modal on success
    } catch (error) {
      console.error("Error creating ride:", error);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 mr-4 ml-4 bg-muted/50 rounded-md">
      {/* "Leaving from" */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Leaving from</label>
        <Input
          placeholder="e.g. Yale"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      {/* "Going to" */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Heading to</label>
        <Input
          placeholder="e.g. Hartford (BDL)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      {/* Date Picker */}
      <div className="flex flex-col relative">
        <label className="block text-sm font-medium">Date</label>
        {mounted ? (
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="border rounded-md p-2 w-full text-sm bg-muted/50 text-foreground"
          >
            {date ? format(date, "yyyy-MM-dd") : "Select a date"}
          </button>
        ) : (
          <div className="border rounded-md p-2 w-full text-sm bg-muted/50 text-foreground">
            Loading...
          </div>
        )}
        {showCalendar && mounted && (
          <div className="absolute z-10 bg-white p-2 shadow-lg rounded-md">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                }
                setShowCalendar(false);
              }}
            />
          </div>
        )}
      </div>



      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Start time</label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End time</label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      {/* “Share a Yide” button (aligned to the right) */}
      <div className="ml-auto">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-5">Share a Yide</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share a Yide</DialogTitle>
              <DialogDescription>
                Fill out the details below to create a new ride listing.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleShareYide}>
              <div>
                <label className="block text-sm font-medium mb-[0.75rem]">
                  Organizer name{" "}
                </label>
                <Input
                  placeholder="Peter Salovey"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium"></label>
                <Input
                  placeholder="555-555-5555"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Number of additional passengers
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 3"
                  value={additionalPassengers}
                  onChange={(e) => setAdditionalPassengers(+e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This does <em>not</em> include you. (So total seats = you +
                  additional.)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Description (optional)
                </label>
                <textarea
                  className="w-full border p-2 rounded text-sm"
                  rows={3}
                  placeholder="I have two suitcases, planning to order an UberXL..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Post Yide</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
