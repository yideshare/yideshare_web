// app/results/page.tsx

import FeedPage from "@/app/feed/feed-page";

import { cookies } from "next/headers";

import { createStartEndDateTimes } from "@/lib/utils/time";
import { ResultsPageProps } from "@/app/interface/main";
import { findBookmarkedRides, findFilteredRides } from "@/lib/utils/ride";
import { extractSearchParams } from "@/lib/utils/search";
import { getUserNetIdFromCookies } from "@/lib/utils/user";

export default async function Results({ searchParams }: ResultsPageProps) {
  // get user cookies
  const cookieStore = await cookies();
  const netId = getUserNetIdFromCookies(cookieStore);

  // if no user cookies were found
  if (netId === null) {
    return <div>Please log in to view your rides.</div>;
  }

  // extract search parameters into query fields
  const {
    from,
    to,
    date,
    startTime: startTimeString,
    endTime: endTimeString,
  } = extractSearchParams(searchParams);

  // create start and end time objects
  const dateObject = new Date(date);
  const { startTimeObject, endTimeObject } = createStartEndDateTimes(
    dateObject,
    startTimeString,
    endTimeString
  );

  // fetch rides that match filter criteria
  const filteredRides = await findFilteredRides(
    from,
    to,
    startTimeObject,
    endTimeObject
  );
  
  // fetch bookmarked rides
  const bookmarks = await findBookmarkedRides(netId);
  const bookmarkedRideIds = bookmarks.map((b) => b.ride.rideId);

  return (
    <FeedPage rides={filteredRides} bookmarkedRideIds={bookmarkedRideIds} />
  );
}
