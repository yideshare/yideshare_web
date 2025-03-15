"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { createStartEndDateTimes } from "@/lib/utils/time";

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
  const [date, setDate] = useState(new Date()); // default to today's date
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [mounted, setMounted] = useState(false); // ensure it renders only on the client
  const [open, setOpen] = React.useState(false);
  //TODO: print out where the error is
  const [errors, setErrors] = useState({
    //requires these fields
    fromError: "",
    toError: "",
    dateError: "",
    startTimeError: "",
    endTimeError: "",
    organizerNameError: "",
    phoneNumberError: "",
  });

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
  const handleFindRide = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure required fields are filled
    if (!from || !to || !date || !startTime || !endTime) {
      setErrors({
        fromError: !from ? "Leaving from is required" : "",
        toError: !to ? "Heading to is required" : "",
        dateError: !date ? "Date is required" : "",
        startTimeError: !startTime ? "Start time is required" : "",
        endTimeError: !endTime ? "End time is required" : "",
        phoneNumberError: "",
        organizerNameError: "",
      });
      return;
    }

    const queryString = `from=${encodeURIComponent(
      from
    )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(
      date.getDate()
    )}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(
      endTime
    )}`;

    // Redirect to results page
    window.location.href = `http://localhost:3000//results?${queryString}`;
  };

  async function handleShareYide(e: React.FormEvent) {
    e.preventDefault();

    let hasError = false;
    const newErrors = { ...errors };

    // Validate the fields
    if (!from) {
      newErrors.fromError = "Leaving from is required";
      hasError = true;
    } else {
      newErrors.fromError = "";
    }

    if (!to) {
      newErrors.toError = "Heading to is required";
      hasError = true;
    } else {
      newErrors.toError = "";
    }

    if (!date) {
      newErrors.dateError = "Date is required";
      hasError = true;
    } else {
      newErrors.dateError = "";
    }

    if (!startTime) {
      newErrors.startTimeError = "Start time is required";
      hasError = true;
    } else {
      newErrors.startTimeError = "";
    }

    if (!endTime) {
      newErrors.endTimeError = "End time is required";
      hasError = true;
    } else {
      newErrors.endTimeError = "";
    }

    if (!organizerName) {
      newErrors.organizerNameError = "Organizer name is required";
      hasError = true;
    } else {
      newErrors.organizerNameError = "";
    }
    if (!phoneNumber) {
      newErrors.phoneNumberError = "Phone number is required";
      hasError = true;
    } else {
      newErrors.phoneNumberError = "";
    }

    setErrors(newErrors);

    if (hasError) {
      return; // Don't submit if there are errors
    }

    const selectedDate = date ? new Date(date) : new Date(); // Use current date if undefined

    const { startTimeObject, endTimeObject } = createStartEndDateTimes(
      selectedDate,
      startTime,
      endTime
    );

    // Convert to ISO string format for Prisma
    const formattedStartTime = startTimeObject.toISOString();
    const formattedEndTime = endTimeObject.toISOString();

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

    const response = await fetch("/api/post-ride", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rideData),
    });

    if (!response.ok) {
      // TODO: add frontend error handling
      return <div>Failed to post ride</div>;
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
          className={`border p-2 rounded-md ${
            errors.fromError ? "border-red-500" : ""
          }`}
        />
      </div>

      {/* "Going to" */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Heading to</label>
        <Input
          placeholder="e.g. Hartford (BDL)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={`border p-2 rounded-md ${
            errors.toError ? "border-red-500" : ""
          }`}
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
      <div className="ml-auto flex flex-col gap-4">
        <Button
          // type="button"
          onClick={handleFindRide}
          className="mt-5"
        >
          Find a Ride
        </Button>

        {/* </div> */}

        {/* “Share a Yide” button (aligned to the right) */}
        {/* <div className="ml-auto"> */}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-5">Share a Yide</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share a Yide</DialogTitle>
              <DialogDescription>
                Fill out the additional details below to create a new ride
                listing. If it doesn't submit, you didn't fill out all required
                fields. TODO on FRONTEND.
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
                <label className="block text-sm font-medium mb-[0.75rem]">
                  Phone Number
                </label>
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
