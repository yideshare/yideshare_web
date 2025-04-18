import FeedPage from "@/app/feed/feed-page";

import { getUserNetIdFromCookies } from "@/lib/user";

export default async function Feed() {
  // get user cookies
  const netId = await getUserNetIdFromCookies();

  // if no user cookies were found
  if (netId === null) {
    return <div>Please log in to view your rides.</div>;
  }

  return <FeedPage />;
}
