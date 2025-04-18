"use client";

import Link from "next/link";

import { NavUser } from "@/components/nav-user";
import { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Bookmark,
  PowerOffIcon,
  MessageSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/frontend";

const navItems = [
  {
    title: "Upcoming Rides",
    // route to /feed or whatever you want
    url: "/feed",
    icon: Calendar,
  },
  // {
  //   title: "Your Friends",
  //   url: "/friends",
  //   icon: Users,
  // },
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
  // TODO: same cors error with redirecting to CAS logout
  {
    title: "Logout",
    url: "/api/auth/logout",
    icon: PowerOffIcon,
    isButton: true,
  },
  // {
  //   title: "Messages",
  //   url: "/messages", // Make sure we have the "Messages" item
  //   icon: MessageSquare,
  // },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    async function fetchAndSetUserData() {
      try {
        const response = await fetch("/api/user-cookies");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user data");
        }

        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchAndSetUserData();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="flex flex-col">
        <nav className="flex-1 space-y-1 px-2 pt-2 mt-[0.3rem]">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.isButton) {
              return (
                <button
                  key={item.title}
                  onClick={() => (window.location.href = item.url)}
                  className={cn(
                    "flex items-center gap-2 rounded p-2 text-sm",
                    "hover:bg-accent hover:text-accent-foreground w-full text-left"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </button>
              );
            }
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex items-center gap-2 rounded p-2 text-sm",
                  "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        {user ? (
          <NavUser
            user={{
              name: user.firstName + " " + user.lastName,
              email: user.email,
              avatar: "",
            }}
          />
        ) : (
          "Loading..."
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
