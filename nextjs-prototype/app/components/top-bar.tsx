// app/components/top-bar.tsx
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerWithTimeRange } from "@/app/components/date-picker"

export function TopBar() {
  // Quick search fields
  const [from, setFrom] = React.useState("")
  const [to, setTo] = React.useState("")
  const [dateTime, setDateTime] = React.useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = React.useState("")
  const [endTime, setEndTime] = React.useState("")

  // “Share a Yide” form fields
  const [organizerName, setOrganizerName] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [additionalPassengers, setAdditionalPassengers] = React.useState(0)
  const [description, setDescription] = React.useState("")

  // Modal open state
  const [open, setOpen] = React.useState(false)

  function handleShareYide(e: React.FormEvent) {
    e.preventDefault()
    console.log("Posting new ride:", {
      from,
      to,
      dateTime,
      organizerName,
      phoneNumber,
      startTime,
      endTime,
      additionalPassengers,
      description,
    })
    setOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 mr-4 ml-4 bg-muted/50 rounded-md">
      {/* "Leaving from" */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Leaving from</label>
        <Input
          placeholder="e.g. Yale"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>

      {/* "Going to" */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Heading to</label>
        <Input
          placeholder="e.g. Hartford (BDL)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      {/* Date & Time picker */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Date & Time</label>
        <DatePickerWithTimeRange
          date={dateTime}
          onDateChange={(date) => setDateTime(date)}
          startTime={startTime}
          onStartTimeChange={(time) => setStartTime(time)}
          endTime={endTime}
          onEndTimeChange={(time) => setEndTime(time)}
        />
      </div>

      {/* “Share a Yide” button (aligned to the right) */}
      <div className="ml-auto">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-5">Share a Yide</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Share a Yide</DialogTitle>
              <DialogDescription>
                Fill out the details below to create a new ride listing.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleShareYide}>
              <div>
                <label className="block text-sm font-medium mb-[0.75rem]">
                  Organizer name <span className="text-gray-400">(optional)</span>
                </label>
                <Input
                  placeholder="Peter Salovey"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Phone number <span className="text-gray-400">(optional)</span>
                </label>
                <Input
                  placeholder="555-555-5555"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {/* New adjacent input fields for "Leaving from" and "Going to" */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Leaving from</label>
                  <Input
                    placeholder="e.g. Yale"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Heading to</label>
                  <Input
                    placeholder="e.g. Hartford (BDL)"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>

              {/* Start & End time side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Start time</label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">End time</label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Number of additional passengers
                </label>
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 3"
                  value={additionalPassengers}
                  onChange={(e) => setAdditionalPassengers(+e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This does <em>not</em> include you. (So total seats = you + additional.)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium">Description (optional)</label>
                <textarea
                  className="w-full border p-2 rounded text-sm"
                  rows={3}
                  placeholder="I have two suitcases, planning to order an UberXL..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <DialogFooter>
                <Button type="submit">Post Yide</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
