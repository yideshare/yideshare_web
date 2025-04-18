// UNUSED

// "use client";

// import {
//   SidebarProvider,
//   SidebarInset,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";
// import { AppSidebar } from "@/components/app-sidebar";
// import FeedClient from "@/app/feed/feed-client";
// import { TopBar } from "@/components/top-bar";
// import { prisma } from "@/lib/prisma";

// // SHADCN "Select" for the Sort By.
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// import * as React from "react";

// export default async function Home() {
//   // Fetch the rides from the database, will probably change to backend API call
//   const fetchedRides = await prisma.ride.findMany({
//     // where: { ownerName: }, # what is the owner name?
//     // take: 5,
//     orderBy: { startTime: "desc" },
//   });

//   // If we want to store the user's selected sort:
//   // (We'll do it in client state, just for demonstration.)
//   // We can let the server ignore this for now:
//   // ...
//   // But remember, this is a Server Component.
//   // So for truly dynamic "sort by," you'd do a client component.
//   // We'll do a quick approach:
//   // Return the component with a client wrapper:

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         {/* The top header with your site name */}
//         <header className="flex h-16 items-center gap-2 px-4 border-b">
//           <SidebarTrigger className="-ml-1" />
//           <Separator orientation="vertical" className="mr-2 h-4" />
//           <h1 className="font-bold text-xl">Yideshare</h1>
//         </header>

//         {/* A single TopBar (Leaving from, Going to, DateTime, Share button) */}
//         <TopBar />

//         {/* Now place Sort By in the top right, just below that TopBar. */}
//         <SortByAndFeed initialRides={fetchedRides} />
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// We'll make a small client component for the sort-by so we can handle onValueChange
// function SortByAndFeed({ initialRides }: { initialRides: any[] }) {
//   const [sortBy, setSortBy] = React.useState("recent");

//   return (
//     <div className="px-4 mt-2">
//       {/* Right-aligned "Sort by" in the same main section, just beneath TopBar */}
//       <div className="flex justify-end mb-4">
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-muted-foreground">Sort by:</span>
//           <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Most Recent" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="recent">Most Recent</SelectItem>
//               <SelectItem value="oldest">Oldest</SelectItem>
//               <SelectItem value="alphabetical">Alphabetical</SelectItem>
//               <SelectItem value="popularity">Popularity</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* The main feed, passing in the rides + selected sort criteria */}
//       {/* <FeedClient initialRides={initialRides} sortBy={sortBy} /> */}
//     </div>
//   );
// }
