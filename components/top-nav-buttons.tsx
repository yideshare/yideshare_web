"use client";

import Link from "next/link";
import {
  Calendar,
  User,
  Bookmark,
  PowerOffIcon,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/frontend";

const navItems = [
  {
    title: "Feed",
    url: "/feed",
    icon: Calendar,
  },
  {
    title: "My Rides",
    url: "/your-rides",
    icon: User,
  },
  {
    title: "My Bookmarks",
    url: "/bookmarks",
    icon: Bookmark,
  },
  {
    title: "Feedback",
    url: "https://docs.google.com/forms/u/1/d/1h6MQYNtshyOujGAfsj2R1mqOdoNTy8YoY0MUdGc1-yo/edit?usp=drive_web",
    icon: MessageSquare,
  },
  {
    title: "Logout",
    url: "/api/auth/logout",
    icon: PowerOffIcon,
    isButton: true,
  },
];

export function TopNavButtons() {
  return (
    <div className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        if (item.isButton) {
          return (
            <Button
              key={item.title}
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = item.url)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Button>
          );
        }
        return (
          <Link
            key={item.title}
            href={item.url}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
