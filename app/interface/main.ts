import { Ride, User } from "@prisma/client";

export interface FeedPageClientProps {
  initialRides: Ride[];
  bookmarkedRideIds: string[];
}

export interface FeedRideCardProps {
  ride: Ride;
  occupants?: User[];
  isBookmarkedInitial: boolean;
  showDialog?: boolean;
}

export interface ResultsPageProps {
  searchParams: searchParamsType;
}

export interface searchParamsType {
  from: string;
  to: string;
  date: string;
  startTime: string;
  endTime: string;
}
