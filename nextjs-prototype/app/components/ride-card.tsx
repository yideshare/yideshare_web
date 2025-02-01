import type { Ride } from '../types/main'

export default function RideCard(ride : Ride)
{
  const convertedMonth:number = (ride.dateTime.getMonth() + 1) % 13;

  return (
    <div className='rounded-lg border p-4 text-center'>
      <h2>Route: {ride.beginning} - {ride.destination}</h2>
      <p>Date: {convertedMonth}/{ride.dateTime.getDate()}/{ride.dateTime.getFullYear()}</p>
      <p>Start time: {ride.dateTime.getHours()}:{ride.dateTime.getMinutes()}</p>
    </div>
  );
}