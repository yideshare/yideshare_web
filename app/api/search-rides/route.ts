import { NextResponse } from "next/server";
import { findFilteredRides } from "@/lib/ride";
import { withApiErrorHandler } from "@/lib/withApiErrorHandler";


async function getHandler(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || new Date().toISOString();
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";

  // Convert date string to Date object
  const dateObject = new Date(date);

    // Create start and end time objects
    const startTimeObject = new Date(dateObject);
    const endTimeObject = new Date(dateObject);

  if (startTime) {
    const [time, period] = startTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let adjustedHours = hours;
    if (period === "PM" && hours !== 12) {
      adjustedHours += 12;
    } else if (period === "AM" && hours === 12) {
      adjustedHours = 0;
    }
    startTimeObject.setHours(adjustedHours, minutes);
  }

  if (endTime) {
    const [time, period] = endTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let adjustedHours = hours;
    if (period === "PM" && hours !== 12) {
      adjustedHours += 12;
    } else if (period === "AM" && hours === 12) {
      adjustedHours = 0;
    }
    endTimeObject.setHours(adjustedHours, minutes);
  }

  // Reset seconds and milliseconds for more accurate filtering
  startTimeObject.setSeconds(0, 0);
  endTimeObject.setSeconds(0, 0);

  // Find rides that match the filter criteria
  const rides = await findFilteredRides(
    from,
    to,
    startTimeObject,
    endTimeObject
  );

  return NextResponse.json(rides);
}

export const GET = withApiErrorHandler(getHandler);
