// yideshare/components/top-bar.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import debounce from "lodash.debounce";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { TimeSelect } from "@/components/ui/time-select";
import { LocationCombobox } from "@/components/location-combobox";
import ShareYideDialog from "./ShareYideDialog";
import { createStartEndDateTimes } from "@/lib/utils/time";

import { Ride } from "@prisma/client";

/* -------------------------------------------------------------------------- */
/*  props                                                                     */
/* -------------------------------------------------------------------------- */

interface TopBarProps {
  /** callback used to push fresh results down to the feed list */
  onResults: (rides: Ride[]) => void;
}

export function TopBar({ onResults }: TopBarProps) {
  /* ----------------  form state  ---------------- */
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [date, setDate] = React.useState<Date | null>(new Date());
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");

  /* share‑a‑ride fields */
  const [open, setOpen] = React.useState(false);
  const [organizerName, setOrganizerName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [additionalPassengers, setAdditionalPassengers] = React.useState(0);
  const [description, setDescription] = React.useState("");

  /* ----------------  helpers  ---------------- */
  const fieldsFilled = from && to && date && startTime && endTime;

  /* ----------------  live search --------------- */
  const runSearch = React.useMemo(
    () =>
      debounce(async () => {
        if (!fieldsFilled) return;

        const qs = new URLSearchParams({
          from,
          to,
          date: date!.toISOString(),
          startTime,
          endTime,
        }).toString();

        try {
          const res = await fetch(`/api/search-rides?${qs}`);
          if (!res.ok) throw new Error("Network error");
          const rides: Ride[] = await res.json();
          onResults(rides);
        } catch (err) {
          console.error(err);
          onResults([]); // empty fallback
        }
      }, 300),
    [from, to, date, startTime, endTime, fieldsFilled, onResults]
  );

  React.useEffect(() => {
    runSearch();
    return runSearch.cancel;
  }, [runSearch]);

  /* ----------------  share‑a‑ride -------------- */
  async function handleShareYide(e: React.FormEvent) {
    e.preventDefault();

    const selectedDate = date ?? new Date();
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

    await fetch("/api/post-ride", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rideData),
    });
  }

  /* ----------------  UI  ---------------- */
  return (
    <div className="flex flex-wrap items-center gap-6 p-6 mx-4">
      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 min-w-[250px] max-w-[400px]">
          <LocationCombobox
            label="Leaving from"
            placeholder="Select start…"
            value={from}
            onChange={setFrom}
          />
        </div>
        <div className="flex-1 min-w-[250px] max-w-[400px]">
          <LocationCombobox
            label="Heading to"
            placeholder="Select destination…"
            value={to}
            onChange={setTo}
          />
        </div>
      </div>

      {/* ---- Event Date (shadcn calendar) ---- */}
      <div className="flex flex-col">
        <label
          htmlFor="event-date"
          className="mb-1 text-sm font-medium leading-none"
        >
          Event Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="event-date"
              variant="outline"
              className="w-[220px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date ?? undefined}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* ---- Start / End time ---- */}
      <div className="grid grid-cols-2 gap-4">
        <TimeSelect
          label="Start time"
          value={startTime}
          onChange={setStartTime}
        />
        <TimeSelect
          label="End time"
          value={endTime}
          onChange={setEndTime}
        />
      </div>

      {/* ---------- Share a Yide ---------- */}
      <div className="ml-auto self-end">
        <Button
          className="bg-primary hover:bg-brand-600 text-primary-foreground"
          onClick={() => setOpen(true)}
        >
          Share a Yide
        </Button>

        <ShareYideDialog
          open={open}
          setOpen={setOpen}
          /* sync with top‑bar fields */
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          /* dialog‑specific */
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
