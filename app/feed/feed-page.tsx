// yideshare/app/feed/feed-page.tsx  (server component)
import FeedPageClient from "@/app/feed/feed-page-client";
import { getUserNetIdFromCookies } from "@/lib/user";
import { findBookmarkedRides, findManyRides } from "@/lib/ride";

export default async function FeedPage() {
  /* ----------------  auth  ---------------- */
  const netId = await getUserNetIdFromCookies();

  if (netId === null) {
    return <div>Please log in to view your rides.</div>;
  }

  /* ----------------  data  ---------------- */
  const initialRides = await findManyRides(10);
  const bookmarks = await findBookmarkedRides(netId);
  const bookmarkedRideIds = bookmarks.map((b) => b.ride.rideId);

  /* ----------------  UI  ---------------- */
  return (
    <FeedPageClient
      initialRides={initialRides}
      bookmarkedRideIds={bookmarkedRideIds}
    />
  );
}
