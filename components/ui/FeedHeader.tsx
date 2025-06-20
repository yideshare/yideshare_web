import Link from "next/link";
import { TopNavButtons } from "@/components/top-nav-buttons";
import React from "react";

export function FeedHeader({ feedbackUrl }: { feedbackUrl: string }) {
  return (
    <header className="bg-background py-8">
      <div className="flex h-16 items-center justify-between px-8 mb-8">
        <div className="flex items-center gap-16">
          <Link href="/feed">
            <h1 className="text-3xl font-righteous text-[#397060] tracking-wide hover:text-[#2d5848] transition-colors">
              Yideshare
            </h1>
          </Link>
          <Link
            href={feedbackUrl}
            className="rounded-full bg-[#397060] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d5848] transition-colors"
          >
            Feedback
          </Link>
        </div>
        <TopNavButtons />
      </div>
    </header>
  );
}