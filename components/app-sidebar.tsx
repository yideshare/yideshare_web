"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { NavUser } from "@/components/nav-user"
import { Calendar, User, Users, Settings, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

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
    title: "Your Rides",
    url: "/dashboard",
    icon: User,
  },
  {
    title: "Messages",
    url: "/messages", // Make sure we have the "Messages" item
    icon: MessageSquare,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {

  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/auth/user")
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
      }
    }

    fetchUserData()
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="flex flex-col">
        <nav className="flex-1 space-y-1 px-2 pt-2 mt-[0.3rem]">
          {navItems.map((item) => {
            const Icon = item.icon
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
            )
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        {user ? (
          <NavUser
            user={{
              name: user.firstName + " " + user.lastName,
              email: user.email,
              avatar: "/avatars/midhun.jpg",
            }}
          />
        ) : (
          "Loading..."
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
