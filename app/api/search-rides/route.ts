import { NextRequest, NextResponse } from "next/server";
import { findFilteredRides } from "@/lib/ride";
import { createStartEndDateTimes } from "@/lib/time";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const date = searchParams.get("date") || new Date().toISOString();
    const startTime = searchParams.get("startTime") || "";
    const endTime = searchParams.get("endTime") || "";

    // convert date string to "Date" object and create time objects with next-day logic
    const dateObject = new Date(date);
    
    let startTimeObject: Date;
    let endTimeObject: Date;
    
    if (startTime && endTime) {
      // use the logic that handles next-day occurences
      const { startTimeObject: start, endTimeObject: end } = createStartEndDateTimes(
        dateObject,
        startTime,
        endTime
      );
      startTimeObject = start;
      endTimeObject = end;
    } else {
      // fallback for when times are not provided
      startTimeObject = new Date(dateObject);
      endTimeObject = new Date(dateObject);
    }

    // Find rides that match the filter criteria
    const rides = await findFilteredRides(
      from,
      to,
      startTimeObject,
      endTimeObject
    );

    return NextResponse.json(rides);
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json(
      { error: "Failed to search rides" },
      { status: 500 }
    );
  }
}
