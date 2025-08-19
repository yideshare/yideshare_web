import { NextResponse } from "next/server";
import { findFilteredRides } from "@/lib/ride";
import { createStartEndDateTimes, decodeDate } from "@/lib/time";
import { withApiErrorHandler } from "@/lib/withApiErrorHandler";

async function getHandler(request: Request) {

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || new Date().toISOString();
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";
  
  // Convert date string to Date object and build EST-based start/end times
  const dateObject = decodeDate(date);
  const { startTimeObject, endTimeObject } = createStartEndDateTimes(
    dateObject,
    startTime,
    endTime
  );

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
