import type { Ride } from '../types/main'

export default function RideCard({ ride }: { ride: Ride })
{
  return (
    <div className="rounded-lg border p-4 text-center">
      <h2>Route: {ride.beginning} - {ride.destination}</h2>
      <p>Date: {ride.date}</p>
      <p>Start time: {ride.startTime}</p>
    </div>
  );
}