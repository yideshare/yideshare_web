// app/dashboard/messages-page.tsx

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import MessagesClient from "./messages-client"

export default function MessagesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4 border-b">
          <h1 className="font-bold text-xl">Messages</h1>
        </header>

        <div className="flex flex-1 flex-col p-4">
          <Separator className="mb-4" />
          <MessagesClient />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
