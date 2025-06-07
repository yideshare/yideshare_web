// UNUSED

// "use client";

// import * as React from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { X, Check, UserMinus } from "lucide-react";
// import { Ride, RideRequest } from "@prisma/client";

// export default function YourRidesClient({
//   initialRides,
// }: {
//   initialRides: Ride[];
// }) {
//   const [rides, setRides] = React.useState(initialRides);

//   return (
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {rides.map((ride) => (
//         <RideCard
//           key={ride.rideId}
//           ride={ride}
//           onUpdate={(updated) => {
//             setRides((prev) =>
//               prev.map((r) => (r.rideId === updated.rideId ? updated : r))
//             );
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// ------------------ The Ride Card + Modal ------------------

// function RideCard({
//   ride,
//   onUpdate,
// }: {
//   ride: Ride;
//   onUpdate: (updatedRide: Ride) => void;
// }) {
//   const { toast } = useToast();

//   // create card title
//   const cardTitle = `${ride.beginning} → ${ride.destination}`;
//   const defaultRequestSenderName = "default sender";

//   // Format date/time
//   const date = new Date(ride.startTime);
//   const month = date.getMonth() + 1;
//   const day = date.getDate();
//   const year = date.getFullYear();
//   const hours = date.getHours();
//   const minutes = String(date.getMinutes()).padStart(2, "0");

//   function handleCloseListing() {
//     toast({
//       title: "Listing Closed",
//       description: `You closed ride #${ride.rideId}.`,
//     });
//     onUpdate({ ...ride, isClosed: true });
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Card className="shadow-md cursor-pointer transition hover:shadow-lg">
//           <CardHeader>
//             <CardTitle className="text-base">{cardTitle}</CardTitle>
//             <CardDescription className="text-sm text-muted-foreground">
//               {ride.isClosed ? "Listing closed" : "Active"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm text-muted-foreground">
//               <strong>Date:</strong> {month}/{day}/{year} at {hours}:{minutes}
//             </p>
//             <p className="text-sm text-muted-foreground">
//               {/* NB: we really, really need to store the name */}
//               <strong>Riders:</strong>
//               {defaultRequestSenderName}
//               {/* {ride.occupantNames.join(", ")} ({ride.occupantNames.length}/{ride.totalSeats} seats) */}
//             </p>
//           </CardContent>
//         </Card>
//       </DialogTrigger>

//       {/* ------------- Modal Content ------------- */}
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>Manage Your Ride</DialogTitle>
//           <DialogDescription>
//             {cardTitle} on {month}/{day}/{year} at {hours}:{minutes}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4">
//           {/* “Requests” section */}
//           {/* <ManageRequests ride={ride} onUpdate={onUpdate} /> */}

//           {/* “Current Riders” section */}
//           <ManageRiders ride={ride} onUpdate={onUpdate} />

//           {/* Action row: close the listing, if not already closed */}
//           <div className="border-t pt-2 flex justify-end space-x-2">
//             {!ride.isClosed ? (
//               <Button variant="destructive" onClick={handleCloseListing}>
//                 Close Listing
//               </Button>
//             ) : (
//               <p className="text-sm text-muted-foreground italic">
//                 This listing is closed.
//               </p>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// ------------------ ManageRequests Subcomponent ------------------
// function ManageRequests({
//   ride,
//   onUpdate,
// }: {
//   ride: Ride;
//   onUpdate: (updatedRide: Ride) => void;
// }) {
//   const { toast } = useToast();

  // function handleAcceptRequest(name: string) {
    // // Move this request into occupantNames
    // const request = ride.requests.find((r) => r.name === name);
    // if (!request) return;
    // // Remove from requests, add to occupantNames
    // const updatedRequests = ride.requests.filter((r) => r.name !== name);
    // const updatedOccupants = [...ride.occupantNames, request.name];
    // onUpdate({
    //   ...ride,
    //   occupantNames: updatedOccupants,
    //   requests: updatedRequests,
    // });
    // toast({
    //   title: "Request accepted",
    //   description: `Added ${name} to your ride.`,
    // });
  // }

  // function handleRejectRequest(name: string) {
    //   const updatedRequests = ride.requests.filter((r) => r.name !== name);
    //   onUpdate({ ...ride, requests: updatedRequests });
    //   toast({
    //     title: "Request rejected",
    //     description: `Rejected ${name}'s request.`,
    //   });
  // }

  // if (ride.requests.length === 0) {
  //   return <p className="text-sm text-muted-foreground">No ride requests.</p>;
  // }

  // return (
  //   <div>
  //     <h3 className="text-sm font-medium mb-2">Requests</h3>
  //     <ul className="space-y-2">
  //       {ride.requests.map((req) => (
  //         <li
  //           key={req.name}
  //           className="flex items-center justify-between bg-muted/30 p-2 rounded"
  //         >
  //           <div>
  //             <p className="text-sm font-semibold">{req.name}</p>
  //             <p className="text-xs text-muted-foreground italic">
  //               “{req.message}”
  //             </p>
  //           </div>
  //           <div className="flex items-center gap-2">
  //             <Button
  //               variant="outline"
  //               size="icon"
  //               onClick={() => handleRejectRequest(req.name)}
  //             >
  //               <X className="h-4 w-4" />
  //             </Button>
  //             <Button
  //               variant="outline"
  //               size="icon"
  //               onClick={() => handleAcceptRequest(req.name)}
  //             >
  //               <Check className="h-4 w-4" />
  //             </Button>
  //           </div>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
// }

// ------------------ ManageRiders Subcomponent ------------------
// function ManageRiders({
//   ride,
//   onUpdate,
// }: {
//   ride: Ride;
//   onUpdate: (updatedRide: Ride) => void;
// }) {
//   const { toast } = useToast();

//   // “Remove” occupant from the occupantNames array
//   function handleRemoveRider(name: string) {
    // // If it’s “You (Raymond Hou)”, skip for now
    // if (name.startsWith("You")) {
    //   toast({
    //     title: "Cannot remove yourself",
    //     description:
    //       "In real app, you'd end/cancel the entire ride, or reassign ownership.",
    //   });
    //   return;
    // }
    // const updatedOccupants = ride.occupantNames.filter((o) => o !== name);
    // onUpdate({ ...ride, occupantNames: updatedOccupants });
    // toast({ title: "Rider removed", description: `Removed ${name}.` });
  // }

  // For demonstration, we’ll just toast
  // function handleMessageRider(name: string) {
  //   toast({
  //     title: `Message sent to ${name}`,
  //     description: "Hello from the driver!",
  //   });
  // }

  // return (
  //   <div></div>

    // <div>
    //   <h3 className="text-sm font-medium mb-2">Current Riders</h3>
    //   {ride.occupantNames.length <= 1 &&
    //   ride.occupantNames[0].startsWith("You") ? (
    //     <p className="text-sm text-muted-foreground">No other riders yet.</p>
    //   ) : (
    //     <ul className="space-y-2">
    //       {ride.occupantNames.map((rider) => (
    //         <li
    //           key={rider}
    //           className="flex items-center justify-between bg-muted/10 p-2 rounded"
    //         >
    //           <p className="text-sm">{rider}</p>
    //           {/* Right side: remove or message */}
    //           <div className="flex items-center gap-2">
    //             <Button
    //               size="icon"
    //               variant="outline"
    //               onClick={() => handleMessageRider(rider)}
    //             >
    //               💬
    //             </Button>
    //             <Button
    //               size="icon"
    //               variant="outline"
    //               onClick={() => handleRemoveRider(rider)}
    //               disabled={rider.startsWith("You")}
    //             >
    //               <UserMinus className="h-4 w-4" />
    //             </Button>
    //           </div>
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
//   );
// }
