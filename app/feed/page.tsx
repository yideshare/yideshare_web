import FeedPage from "@/app/feed/feed-page";

import { cookies } from "next/headers";
import { getUserNetIdFromCookies } from "@/lib/utils/user";
import { findBookmarkedRides, findManyRides } from "@/lib/utils/ride";

export default async function Feed() {
  // get user cookies
  const cookieStore = await cookies();
  const netId = getUserNetIdFromCookies(cookieStore);

  // if no user cookies were found
  if (netId === null) {
    return <div>Please log in to view your rides.</div>;
  }

  // fetch initial rides
  const initialRides = await findManyRides(10);

  // fetch bookmarked rides
  const bookmarks = await findBookmarkedRides(netId);
  const bookmarkedRideIds = bookmarks.map((b) => b.ride.rideId);

  return (
    <FeedPage rides={initialRides} bookmarkedRideIds={bookmarkedRideIds} />
  );
}
