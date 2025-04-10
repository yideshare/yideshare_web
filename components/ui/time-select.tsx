/**
 * shadcn‑style time dropdown (15‑minute increments)
 */
"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------------------------------------------ */
/*  create “12:00 AM”, “12:15 AM”, …                                   */
/* ------------------------------------------------------------------ */
const OPTIONS: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 15) {
    const hour12 = ((h + 11) % 12) + 1;
    const suffix = h < 12 ? "AM" : "PM";
    OPTIONS.push(
      `${hour12.toString().padStart(2, "0")}:${m
        .toString()
        .padStart(2, "0")} ${suffix}`
    );
  }
}

/* ------------------------------------------------------------------ */
/*  component                                                         */
/* ------------------------------------------------------------------ */
interface TimeSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function TimeSelect({
  label,
  value,
  onChange,
  className,
}: TimeSelectProps) {
  return (
    <div className={className}>
      <p className="mb-1 text-sm font-medium">{label}</p>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-[120px]">
          <SelectValue placeholder="--:--" />
        </SelectTrigger>

        <SelectContent className="max-h-60">
          {OPTIONS.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
