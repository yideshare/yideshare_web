// app/bookmarks/page.tsx

import { cookies } from "next/headers";
import { getUserNetIdFromCookies } from "@/lib/utils/user";
import { findBookmarkedRides } from "@/lib/utils/ride";
import BookmarksClient from "./bookmarks-client";

export default async function BookmarkPage() {
  // get user cookies
  const cookieStore = await cookies();
  const netId = getUserNetIdFromCookies(cookieStore);

  // if no user cookies were found
  if (netId === null) {
    return <div>Please log in to view your rides.</div>;
  }

  // fetch bookmarked rides for the authenticated user
  const bookmarks = await findBookmarkedRides(netId);

  // extract the rides from the prisma query
  const bookmarkedRides = bookmarks.map((b) => b.ride);

  return <BookmarksClient bookmarkedRides={bookmarkedRides} />;
}
