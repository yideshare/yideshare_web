"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createStartEndDateTimes } from "@/lib/utils/time";
import DatePicker from "./date-picker";
import LabeledInput from "./labeled-input";
import ShareYideDialog from "./ShareYideDialog";

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

  const mainForm_unfilled = !from || !to || !date || !startTime || !endTime;

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

    const selectedDate = date ? new Date(date) : new Date(); // Use current date if undefined
    const { startTimeObject, endTimeObject } = createStartEndDateTimes(
      selectedDate,
      startTime,
      endTime
    );

    const rideData = {
      ownerName: organizerName,
      ownerPhone: phoneNumber,
      beginning: from,
      destination: to,
      description,
      startTime: startTimeObject,
      endTime: endTimeObject,
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
      <LabeledInput
        label="Leaving from"
        placeholder="e.g. Yale"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />
      <LabeledInput
        label="Heading to"
        placeholder="e.g. Hartford (BDL)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />
      <DatePicker
        date={date}
        setDate={setDate}
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        mounted={mounted}
      />

      <div className="grid grid-cols-2 gap-4">
        <LabeledInput
          label="Start time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <LabeledInput
          label="End time"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>
      <div className="ml-auto flex flex-col gap-4">
        <Button
          onClick={handleFindRide}
          className="mt-5"
          disabled={mainForm_unfilled}
        >
          Find a Ride
        </Button>
        <Button
          className="mt-5"
          onClick={() => setOpen(true)}
          disabled={mainForm_unfilled}
        >
          Share a Yide
        </Button>
        <ShareYideDialog
          open={open}
          setOpen={setOpen}
          organizerName={organizerName}
          setOrganizerName={setOrganizerName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          additionalPassengers={additionalPassengers}
          setAdditionalPassengers={setAdditionalPassengers}
          description={description}
          setDescription={setDescription}
          handleShareYide={handleShareYide}
        />
      </div>
    </div>
  );
}
