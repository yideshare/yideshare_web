"use client";

import Image from "next/image";
import { LogIn, MapPin, Calendar, Users } from "lucide-react";
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
          <nav className="flex items-center justify-center px-4 py-4 sm:px-6 lg:px-12">
            <Link href="/feed">
              <h1 className="font-righteous tracking-wide text-white text-xl sm:text-2xl md:text-3xl hover:text-white/90 transition-colors">
                Yideshare
              </h1>
            </Link>
          </nav>

          {/* ---- HERO CONTENT ---- */}
          <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 mb-12 sm:mb-16">
            {/* Headline & Subtitle */}
            <div className="max-w-3xl mt-6 sm:mt-10 mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-righteous tracking-wide leading-tight text-white">
                Share the ride. Save the planet.
                <br />
                Split the cost.
              </h2>
            </div>
          </div>

          {/* ---- LOGIN BUTTON ---- */}
          <div className="px-4 sm:px-6 pb-12 sm:pb-16 flex justify-center">
            <button
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                const r = params.get("redirect");
                const target = r
                  ? `/api/auth/cas-login?redirect=${encodeURIComponent(r)}`
                  : "/api/auth/cas-login";
                window.location.href = target;
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-3 text-sm sm:text-base font-semibold text-primary shadow hover:bg-white"
            >
              <LogIn size={18} className="w-5 h-5" />
              <span>Log in with CAS</span>
            </button>
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

      {/* ================= FRIENDS PREVIEW (BOTTOM) ================= */}
      <section className="bg-[#7DA395]/60 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 text-center">
          <h3 className="font-righteous text-white text-2xl sm:text-3xl md:text-4xl tracking-wide mb-8">
            See where your friends are going
          </h3>

          <div className="mx-auto w-full max-w-5xl">
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-white/10 ring-1 ring-black/5">
              <Image
                src="/assets/feed.png"
                alt="Yideshare feed preview"
                width={1600}
                height={900}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
