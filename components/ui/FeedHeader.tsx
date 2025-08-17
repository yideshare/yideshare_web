import Link from "next/link";
import { TopNavButtons } from "@/components/top-nav-buttons";
import React from "react";

export function FeedHeader({ feedbackUrl }: { feedbackUrl: string }) {
  return (
    <header className="bg-background py-4 sm:py-6 lg:py-8">
      <div className="flex h-12 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-16">
          <Link href="/feed">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-righteous text-[#397060] tracking-wide hover:text-[#2d5848] transition-colors">
              Yideshare
            </h1>
          </Link>
          <Link
            href={feedbackUrl}
            className="rounded-full bg-[#397060] px-2 py-1 sm:px-3 sm:py-2 lg:px-4 text-xs sm:text-sm font-medium text-white hover:bg-[#2d5848] transition-colors"
          >
            Feedback
          </Link>
        </div>
        <TopNavButtons />
      </div>
    </header>
  );
}
