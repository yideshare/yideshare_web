// yideshare/components/top-bar.tsx
"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronsUpDown } from "lucide-react";

// import debounce from "lodash.debounce";

import { encodeDate } from "@/lib/time";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { TimeSelect } from "@/components/ui/time-select";
import { LocationCombobox } from "@/components/location-combobox";
import { createStartEndDateTimes, isNextDay } from "@/lib/time";
import ShareYideDialog from "./ShareYideDialog";

import { Ride } from "@prisma/client";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

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
  const { toast } = useToast();
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
  const [additionalPassengers, setAdditionalPassengers] = React.useState(3);
  const [description, setDescription] = React.useState("");

  // New state to track if a search is active
  const [hasSearched, setHasSearched] = React.useState(false);

  const [errors, setErrors] = React.useState({
    //requires these fields
    fromError: "",
    toError: "",
    dateError: "",
    startTimeError: "",
    endTimeError: "",
    organizerNameError: "",
    phoneNumberError: "",
  });

  React.useEffect(() => {
    setDate(new Date());
  }, []);

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
      console.log(errors);
      return;
    }

    const qs = new URLSearchParams({
      from,
      to,
      date: encodeDate(date),
      startTime,
      endTime,
    }).toString();

    try {
      const res = await fetch(`/api/search-rides?${qs}`);
      if (!res.ok) throw new Error("Network error");
      const ridesResult: Ride[] = await res.json();
      onResults(ridesResult);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      onResults([]);
      setHasSearched(true);
    }
  };

  const handleClearSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.reload();
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
      const res = await fetch(`${API_BASE}/api/post-ride`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rideData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to post ride");
      }

      const newRide = await res.json();

      // Update the feed with the new ride
      if (rides) {
        onResults([newRide.ride, ...rides]);
      }

      // Reset form fields
      setFrom("");
      setTo("");
      setStartTime("");
      setEndTime("");
      setOrganizerName("");
      setPhoneNumber("");
      setAdditionalPassengers(0);
      setDescription("");
      setDate(new Date());

      // Show success toast
      toast({
        title: "Ride Posted",
        description: "Your ride has been successfully posted.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to post ride. Please try again.",
        variant: "destructive",
      });
    }
  }

  /* ----------------  UI  ---------------- */
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 w-full max-w-[1400px] mx-auto bg-white p-4 sm:p-4 sm:pr-2 rounded-2xl shadow-sm mb-8">
      <div className="w-full sm:w-auto sm:flex-none sm:min-w-[180px]">
        <label className="text-sm font-bold text-black">Leaving from</label>
        <LocationCombobox
          label=""
          placeholder=""
          value={from}
          onChange={setFrom}
          aria-label="Select departure location"
        />
      </div>
      <div className="w-full sm:w-auto sm:flex-none sm:min-w-[180px]">
        <label className="text-sm font-bold text-black">Going to</label>
        <LocationCombobox
          label=""
          placeholder=""
          value={to}
          onChange={setTo}
          aria-label="Select destination location"
        />
      </div>
      <div className="w-full sm:w-auto sm:flex-none max-w-[250px] sm:min-w-[180px]">
        <label className="text-sm font-bold text-black">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="event-date"
              variant="outline"
              role="combobox"
              aria-label="Select departure date"
              className="justify-start text-left text-lg font-bold bg-transparent text-black w-full border-[#cde3dd] focus:ring-[#cde3dd] h-10"
            >
              {date ? (
                format(date, "PPP")
              ) : (
                <span className="text-gray-500">Select date</span>
              )}
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
      <div className="w-full sm:w-auto sm:flex-none max-w-[300px] sm:min-w-[220px]">
        <label className="text-sm font-bold text-black">
          Departure Time Range (EST)
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="justify-start text-left text-lg font-bold bg-transparent text-black w-full border-[#cde3dd] focus:ring-[#cde3dd] h-10"
            >
              {startTime && endTime ? (
                <>
                  {`${startTime} - ${endTime}`}
                  {isNextDay(startTime, endTime) && (
                    <span className="text-xs text-gray-500 ml-1">(+1)</span>
                  )}
                </>
              ) : (
                <span className="text-gray-500">Select time</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="flex gap-4">
              <TimeSelect
                label="Earliest departure"
                value={startTime}
                onChange={setStartTime}
                className="bg-transparent w-full border-[#cde3dd] focus:ring-[#cde3dd]"
              />
              <TimeSelect
                label={<>Latest departure</>}
                value={endTime}
                onChange={setEndTime}
                startTime={startTime}
                isEndTime={true}
                className="bg-transparent w-full border-[#cde3dd] focus:ring-[#cde3dd]"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full sm:w-auto sm:flex-none flex gap-2 justify-center sm:justify-start">
        <Button
          className="bg-[#cde3dd] hover:bg-[#b8d4cc] text-[#397060] h-10 rounded-full w-[100px]"
          onClick={hasSearched ? handleClearSearch : handleFindRide}
        >
          {hasSearched ? "Clear Search" : "Search"}
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
