"use client";

import * as React from "react";
import { format } from "date-fns";
// If you don't have lucide-react, install or swap the icon import:
import { Calendar as CalendarIcon } from "lucide-react"; 

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

/**
 * This component shows:
 *   1) A calendar for selecting a single date
 *   2) Two <input type="time" /> fields for selecting a start and end time
 *   3) A popover trigger button that displays "MM/dd/yyyy, hh:mm – hh:mm"
 */
interface DatePickerWithTimeRangeProps {
  /** Currently selected date (day). Undefined means no date selected. */
  date?: Date;
  /** Called when user picks a new date from the calendar. */
  onDateChange?: (date: Date) => void;

  /** Start time in HH:mm (24-hour) or HH:mm (AM/PM) format. */
  startTime?: string;
  /** Called when user picks a new start time. */
  onStartTimeChange?: (time: string) => void;

  /** End time in HH:mm (24-hour) or HH:mm (AM/PM) format. */
  endTime?: string;
  /** Called when user picks a new end time. */
  onEndTimeChange?: (time: string) => void;
}

export function DatePickerWithTimeRange({
  date,
  onDateChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
}: DatePickerWithTimeRangeProps) {
  const [open, setOpen] = React.useState(false);

  function handleDateSelect(selected: Date | undefined) {
    if (selected && onDateChange) {
      onDateChange(selected);
    }
  }

  // We'll display something like "08/31/2025" or "Pick date" if none
  const displayDate = date ? format(date, "MM/dd/yyyy") : "Pick date";

  // For the time portion, show something like "08:00 – 09:30"
  let displayTime = "(any times)";
  if (startTime && endTime) {
    displayTime = `${startTime} - ${endTime}`;
  } else if (startTime) {
    displayTime = startTime;
  } else if (endTime) {
    displayTime = endTime;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[250px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayDate}, {displayTime}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-4 space-y-4 w-auto">
        {/* 1) The calendar for selecting a day */}
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />

        {/* 2) Start/End time inputs */}
        <div className="flex items-center justify-between space-x-2">
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium">Start time</label>
            <input
              type="time"
              className="border rounded px-2 py-1 text-sm"
              value={startTime || ""}
              onChange={(e) => onStartTimeChange?.(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-xs font-medium">End time</label>
            <input
              type="time"
              className="border rounded px-2 py-1 text-sm"
              value={endTime || ""}
              onChange={(e) => onEndTimeChange?.(e.target.value)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
