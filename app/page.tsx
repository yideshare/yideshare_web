"use client";

import Image from "next/image";
import { LogIn, MapPin, Calendar, Users } from "lucide-react";
// import { LocationCombobox } from "@/components/location-combobox";
// import { Button } from "@/components/ui/button";
// import { Calendar as ShadCalendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
import * as React from "react";
import Link from "next/link";

export default function Home() {
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
          <nav className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-12">
            <Link href="/feed">
              <h1 className="font-righteous tracking-wide text-white text-xl sm:text-2xl md:text-3xl hover:text-white/90 transition-colors">
                Yideshare
              </h1>
            </Link>
            <button
              onClick={() => (window.location.href = "/api/auth/cas-login")}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 sm:px-5 text-xs sm:text-sm font-semibold text-primary shadow hover:bg-white"
            >
              <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Log in with CAS</span>
              <span className="xs:hidden">Login</span>
            </button>
          </nav>

          {/* ---- HERO CONTENT ---- */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-6">
            {/* Headline & Subtitle */}
            <div className="max-w-3xl mt-6 sm:mt-10 mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Ride together.{" "}
                <span className="text-white">Split the cost.</span>
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg font-light text-white/90 px-2">
                Headed to the airport? A concert? Home for break? Yideshare
                helps Yale students coordinate cheap, reliable rides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROP ================= */}
      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-12 sm:py-20 text-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
          Why Yideshare?
        </h3>
        <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base text-gray-600 px-2">
          Match with other Yalies headed the same way and save money on Ubers,
          Lyfts, and carpools.
        </p>

        <div className="mt-10 sm:mt-16 grid gap-8 sm:gap-12 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <Users size={40} className="sm:w-12 sm:h-12 text-primary" />
            <h4 className="text-base sm:text-lg font-semibold text-foreground">
              Yale‑only network
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 px-4 sm:px-0">
              Log in with CAS to join a trusted community of classmates.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <Calendar size={40} className="sm:w-12 sm:h-12 text-primary" />
            <h4 className="text-base sm:text-lg font-semibold text-foreground">
              Instant matching
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 px-4 sm:px-0">
              Post a ride and instantly match with others on the same schedule.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <MapPin size={40} className="sm:w-12 sm:h-12 text-primary" />
            <h4 className="text-base sm:text-lg font-semibold text-foreground">
              Budget‑friendly & low‑impact
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 px-4 sm:px-0">
              Split fares and reduce emissions—everyone wins.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
