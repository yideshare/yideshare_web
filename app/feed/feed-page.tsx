import FeedClient from "@/app/feed/feed-client";

import { TopBar } from "@/components/top-bar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { FeedClientProps } from "@/app/interface/main";
import { LogoutButton } from "@/components/logout-button";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function FeedPage({
  rides,
  bookmarkedRideIds,
}: FeedClientProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="">
          <div className="flex h-16 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="font-bold text-xl">Yideshare</h1>
            <div className="ml-auto">
              <LogoutButton />
            </div>
          </div>
          <TopBar />
        </header>
        <FeedClient rides={rides} bookmarkedRideIds={bookmarkedRideIds} />
      </SidebarInset>
    </SidebarProvider>
  );
}
