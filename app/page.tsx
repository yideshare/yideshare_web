"use client";

import Image from "next/image";
import { LogIn, MapPin, Calendar, Users } from "lucide-react";
import { LocationCombobox } from "@/components/location-combobox";
import { Button } from "@/components/ui/button";
import { Calendar as ShadCalendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import * as React from "react";

export default function Home() {
  const [date, setDate] = React.useState<Date | null>(new Date());
  // Add state for the from and to locations
  const [fromLocation, setFromLocation] = React.useState<string>("");
  const [toLocation, setToLocation] = React.useState<string>("");

  return (
    <main className="relative min-h-screen bg-white flex flex-col">
      {/* ================= HERO ================= */}
      <section className="relative w-full min-h-[32rem]">
        {/* Background Image */}
        <Image
          src="/assets/image3.png"
          alt="Scenic road through mountains viewed from inside a car"
          fill
          priority
          className="object-cover"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* NAV + HERO CONTENT */}
        <div className="relative z-10 flex flex-col h-full">
          {/* ---- NAV ---- */}
          <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
            <h1 className="font-righteous tracking-wide text-white text-2xl md:text-3xl">
              Yideshare
            </h1>
            <button
              onClick={() => (window.location.href = "/api/auth/cas-login")}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-primary shadow hover:bg-white"
            >
              <LogIn size={18} />
              Log in with CAS
            </button>
          </nav>

          {/* ---- HERO CONTENT ---- */}
          <div className="flex-1 flex flex-col justify-center px-6">
            {/* Headline & Subtitle */}
            <div className="max-w-3xl mt-10 mx-auto text-center">
              <h2 className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
                Ride together.{" "}
                <span className="text-white">Split the cost.</span>
              </h2>
              <p className="mt-4 text-base font-light text-white/90 md:text-lg">
                Headed to the airport? A concert? Home for break? Yideshare
                helps Yale students coordinate cheap, reliable rides.
              </p>
            </div>

            {/* Search Form */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-8 w-full max-w-5xl mx-auto bg-white/90 backdrop-blur-md shadow-lg px-6 py-6 rounded-2xl"
            >
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[180px]">
                  <LocationCombobox
                    label="From"
                    placeholder="Leaving from"
                    value={fromLocation}
                    onChange={(val) => {
                      setFromLocation(val);
                    }}
                  />
                </div>
                <div className="flex-1 min-w-[180px]">
                  <LocationCombobox
                    label="To"
                    placeholder="Going to"
                    value={toLocation}
                    onChange={(val) => {
                      setToLocation(val);
                    }}
                  />
                </div>

                {/* Date Picker */}
                <div className="flex flex-col">
                  <label htmlFor="date" className="mb-1 text-sm font-medium">
                    Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className="w-[180px] justify-start text-left font-normal bg-white"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <ShadCalendar
                        mode="single"
                        selected={date ?? undefined}
                        onSelect={(day) => setDate(day ?? null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="rounded-full bg-[#386f5f] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-[#2b574c]"
                >
                  Find a ride
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROP ================= */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20 text-center">
        <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
          Why Yideshare?
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600">
          Match with other Yalies headed the same way and save money on Ubers,
          Lyfts, and carpools.
        </p>

        <div className="mt-16 grid gap-12 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-4">
            <Users size={48} className="text-primary" />
            <h4 className="text-lg font-semibold text-foreground">
              Yale‑only network
            </h4>
            <p className="text-sm text-gray-600">
              Log in with CAS to join a trusted community of classmates.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Calendar size={48} className="text-primary" />
            <h4 className="text-lg font-semibold text-foreground">
              Instant matching
            </h4>
            <p className="text-sm text-gray-600">
              Post a ride and instantly match with others on the same schedule.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <MapPin size={48} className="text-primary" />
            <h4 className="text-lg font-semibold text-foreground">
              Budget‑friendly & low‑impact
            </h4>
            <p className="text-sm text-gray-600">
              Split fares and reduce emissions—everyone wins.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
