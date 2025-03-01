"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { X, Check, MessageSquare } from "lucide-react"
import { Ride, User, RideRequest } from "@prisma/client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProfileRideCard(ride: Ride, occupants: User[], requests: RideRequest[]) {
  const { toast } = useToast()

  const cardTitle = `${ride.beginning} → ${ride.destination}`
  const occupantNames = occupants ?? ["You"]
  const totalSeats = ride.totalSeats
  const occupantCount = ride.currentTakenSeats
  const isClosed = ride.isClosed

  // local state for requests
  //const [requests, setRequests] = React.useState(ride.requests ?? [])

  const dateObj = new Date(ride.startTime)
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours()
  const minutes = String(dateObj.getMinutes()).padStart(2, "0")

  const defaultRequestSenderName = "default sender"

  function handleCloseListing() {
    toast({
      title: "Listing Closed",
      description: `You closed ride #${ride.id}.`,
    })
  }

  function handleRemove() {
    toast({
      title: "Ride Removed",
      description: `You removed ride #${ride.id}.`,
    })
  }

  // frontend function,
  // TODO: replace with a fetch later

  function handleAcceptRequest(name: string) {
    setRequests((prev) => prev.filter((r) => r.name !== name))
    toast({
      title: "Request Accepted",
      description: `You accepted ${name}'s request.`,
    })
  }

  // frontend function,
  // TODO: replace with a fetch later
  
  function handleRejectRequest(name: string) {
    setRequests((prev) => prev.filter((r) => r.name !== name))
    toast({
      title: "Request Rejected",
      description: `You rejected ${name}'s request.`,
    })
  }

  function handleMessageAll() {
    toast({
      title: "Message Sent",
      description: `You messaged all riders in ride #${ride.id}.`,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="shadow-md cursor-pointer hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="text-base">{cardTitle}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {isClosed ? "Listing closed" : "Active"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Date:</strong> {month}/{day}/{year} at {hours}:{minutes}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Riders:</strong> {occupantNames.join(", ")} (
              {occupantCount}/{totalSeats} seats)
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Your Ride</DialogTitle>
          <DialogDescription>
            Ride #{ride.id} • {cardTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isClosed ? (
            <p className="text-sm text-muted-foreground italic">
              This listing is closed.
            </p>
          ) : (
            <p>This listing is active. You can remove or close it below.</p>
          )}

          {/* Show requests */}
          <div>
            <h3 className="text-sm font-semibold">Requests</h3>
            {requests.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No pending requests
              </p>
            ) : (
              <ul className="space-y-2">
                {requests.map((r) => (
                  <li
                  // why use name as a key?
                  // use random uuid instead
                    key={randomUUID()}
                    className="flex items-center justify-between bg-muted/20 p-2 rounded"
                  >
                    <div>
                      <p className="text-sm font-medium">{defaultRequestSenderName}</p>
                      <p className="text-xs italic text-muted-foreground">
                        {r.payload}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        // onClick={() => handleRejectRequest(r.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        // onClick={() => handleAcceptRequest(r.name)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {!isClosed && (
              <Button variant="destructive" onClick={handleCloseListing}>
                Close Listing
              </Button>
            )}
            <Button variant="outline" onClick={handleRemove}>
              Remove Ride
            </Button>
            <Button variant="outline" onClick={handleMessageAll}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Riders
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
