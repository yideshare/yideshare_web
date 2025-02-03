"use client"

import * as React from "react"
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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Bookmark } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Ride {
  id: string
  dateTime: Date
  beginning: string
  destination: string
  totalSeats?: number
  occupants?: Array<{ name: string }>
  postedAgo?: string
  rideDescription?: string
}

export default function FeedRideCard(ride: Ride) {
  const { toast } = useToast()

  const totalSeats = ride.totalSeats ?? 4
  const occupantCount = ride.occupants ? ride.occupants.length : 1
  const postedAgo = ride.postedAgo || "1d ago"
  const driverName = ride.occupants?.[0]?.name || "Raymond Hou"
  const occupantNames = ride.occupants?.map((o) => o.name).join(", ") || "Unknown"

  const [requestSeat, setRequestSeat] = React.useState(false)
  const [message, setMessage] = React.useState("")

  // Format date/time
  const dateObj = new Date(ride.dateTime)
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours()
  const minutes = String(dateObj.getMinutes()).padStart(2, "0")

  function handleBookmark() {
    toast({
      title: "Ride Bookmarked",
      description: `Ride #${ride.id} was bookmarked!`,
    })
  }
  function handleAddToCalendar() {
    toast({
      title: "Added to Calendar",
      description: `Ride #${ride.id} was added to your calendar!`,
    })
  }
  function handleSend() {
    toast({
      title: "Message Sent",
      description: `Message sent to ${driverName}. (Request seat: ${requestSeat ? "Yes" : "No"})`,
    })
    setMessage("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* Add w-full so it spans the container’s width */}
        <Card className="w-full relative shadow-md cursor-pointer transition hover:shadow-lg">
          <span className="absolute top-2 right-2 text-xs text-muted-foreground">
            {postedAgo}
          </span>

          <CardHeader className="flex flex-col gap-1">
            <CardTitle className="text-base">
              {ride.beginning} → {ride.destination}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Posted by: {driverName} • {occupantCount}/{totalSeats} seats filled
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Date:</strong> {month}/{day}/{year}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Time:</strong> {hours}:{minutes}
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Ride Details</span>
            <Button variant="ghost" size="icon" onClick={handleBookmark}>
              <Bookmark className="h-5 w-5" />
            </Button>
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-muted-foreground text-sm mt-1">
              <div className="flex items-center gap-2">
                Posted by: <strong>{driverName}</strong>
                <span>•</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="underline decoration-dotted cursor-help">
                        {occupantCount}/{totalSeats} seats filled
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">{occupantNames}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <div className="text-sm text-muted-foreground italic">
            “{ride.rideDescription ?? "I have two suitcases, might share an UberXL..."}”
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium mr-2">Message the driver:</label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requestSeat"
                checked={requestSeat}
                onCheckedChange={(v) => setRequestSeat(Boolean(v))}
              />
              <label htmlFor="requestSeat" className="text-sm font-medium">
                Request a seat
              </label>
            </div>
          </div>

          <textarea
            className="w-full border p-2 rounded text-sm"
            rows={3}
            placeholder="Hi, is this ride still available..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleAddToCalendar}>
              Add to Calendar
            </Button>
            <Button variant="secondary" onClick={handleSend}>
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
