// yideshare/app/feed/feed-page.tsx  (server component)
import FeedPageClient from "@/app/feed/feed-page-client";
import { cookies } from "next/headers";
import { getUserNetIdFromCookies } from "@/lib/utils/user";
import { findBookmarkedRides, findManyRides } from "@/lib/utils/ride";

export default async function FeedPage() {
  /* ----------------  auth  ---------------- */
  const cookieStore = cookies();
  const netId = getUserNetIdFromCookies(cookieStore);

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
