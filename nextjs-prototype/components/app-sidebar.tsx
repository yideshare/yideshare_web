// app/components/app-sidebar.tsx
"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import { Calendar, User, Users, Settings, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Upcoming Rides",
    // route to /feed or whatever you want
    url: "/feed",
    icon: Calendar,
  },
  {
    title: "Your Friends",
    url: "/friends",
    icon: Users,
  },
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
        <NavUser
          user={{
            name: "Midhun Sadanand",
            email: "midhun.sadanand@yale.edu",
            avatar: "/avatars/midhun.jpg",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
