// yideshare/components/top-bar.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ArrowUpRight, ArrowDownRight, ChevronsUpDown } from "lucide-react";
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
import { SelectValue } from "@/components/ui/select";

/* -------------------------------------------------------------------------- */
/*  props                                                                     */
/* -------------------------------------------------------------------------- */

interface TopBarProps {
  /** callback used to push fresh results down to the feed list */
  onResults: (rides: Ride[]) => void;
  /** current rides in the feed */
  rides?: Ride[];
}

export function TopBar({ onResults, rides }: TopBarProps) {
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
      debounce(async (force = false) => {
        // Always clear results first
        onResults([]);

        // If not all fields are filled and not forced, return early
        if (!fieldsFilled && !force) {
          return;
        }

        // If date is null, use current date
        const searchDate = date ?? new Date();

        const qs = new URLSearchParams({
          from: from || "",
          to: to || "",
          date: searchDate.toISOString(),
          startTime: startTime || "",
          endTime: endTime || "",
        }).toString();

        try {
          const res = await fetch(`/api/search-rides?${qs}`);
          if (!res.ok) throw new Error("Network error");
          const rides: Ride[] = await res.json();
          // Only update results if we got valid rides back
          if (Array.isArray(rides)) {
            onResults(rides);
          } else {
            onResults([]);
          }
        } catch (err) {
          console.error(err);
          onResults([]);
        }
      }, 300),
    [from, to, date, startTime, endTime, fieldsFilled, onResults]
  );

  // Remove the automatic search on mount
  // React.useEffect(() => {
  //   runSearch();
  //   return runSearch.cancel;
  // }, [runSearch]);

  const handleSearchClick = () => {
    runSearch(true);
  };

  /* ----------------  share‑a‑ride -------------- */
  async function handleShareYide(e: React.FormEvent) {
    e.preventDefault();

    const selectedDate = date ?? new Date();
    const { startTimeObject, endTimeObject } = createStartEndDateTimes(
      selectedDate,
      startTime,
      endTime
    );

    console.log(selectedDate, startTime, endTime)

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

    try {
      const response = await fetch("/api/post-ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rideData),
      });

      if (!response.ok) {
        throw new Error("Failed to post ride");
      }

      const { ride: newRide } = await response.json();

      // Clear the form fields
      setFrom("");
      setTo("");
      setDate(new Date());
      setStartTime("");
      setEndTime("");
      setOrganizerName("");
      setPhoneNumber("");
      setAdditionalPassengers(0);
      setDescription("");

      // Add the new ride to the feed immediately
      onResults([newRide, ...(rides || [])]);
    } catch (error) {
      console.error("Error posting ride:", error);
    }
  }

  /* ----------------  UI  ---------------- */
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 w-full max-w-[1400px] mx-auto bg-white p-4 sm:p-4 sm:pr-2 rounded-2xl shadow-sm mb-8">
      <div className="w-full sm:w-auto sm:flex-none sm:min-w-[180px] sm:min-w-[200px]">
        <label className="text-sm font-bold text-black">Leaving from</label>
        <LocationCombobox
          label=""
          placeholder=""
          value={from}
          onChange={setFrom}
        />
      </div>
      <div className="w-full sm:w-auto sm:flex-none sm:min-w-[180px] sm:min-w-[200px]">
        <label className="text-sm font-bold text-black">Going to</label>
        <LocationCombobox
          label=""
          placeholder=""
          value={to}
          onChange={setTo}
        />
      </div>
      <div className="w-full sm:w-auto sm:flex-none sm:min-w-[180px] sm:min-w-[200px]">
        <label className="text-sm font-bold text-black">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="event-date"
              variant="outline"
              role="combobox"
              className="justify-start text-left text-lg font-bold bg-transparent text-black w-full border-[#cde3dd] focus:ring-[#cde3dd] h-10"
            >
              {date ? format(date, "PPP") : <span className="text-gray-500">Select date</span>}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date ?? undefined}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full sm:w-auto sm:flex-none sm:min-w-[180px] sm:min-w-[200px]">
        <label className="text-sm font-bold text-black">Time (EST)</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="justify-start text-left text-lg font-bold bg-transparent text-black w-full border-[#cde3dd] focus:ring-[#cde3dd] h-10"
            >
              {startTime && endTime ? `${startTime} - ${endTime}` : <span className="text-gray-500">Select time</span>}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="flex gap-4">
              <TimeSelect
                label="Start time"
                value={startTime}
                onChange={setStartTime}
                className="bg-transparent w-full border-[#cde3dd] focus:ring-[#cde3dd]"
              />
              <TimeSelect
                label="End time"
                value={endTime}
                onChange={setEndTime}
                className="bg-transparent w-full border-[#cde3dd] focus:ring-[#cde3dd]"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full sm:w-auto sm:flex-none flex gap-2 justify-center sm:justify-start">
        <Button
          className="bg-[#cde3dd] hover:bg-[#b8d4cc] text-[#397060] h-10 rounded-full w-[100px]"
          onClick={handleSearchClick}
        >
          Search
        </Button>
        <Button
          className="bg-[#397060] hover:bg-[#2d5848] text-white h-10 rounded-full w-[100px]"
          onClick={() => setOpen(true)}
        >
          Post Ride
        </Button>
      </div>

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
  );
}
