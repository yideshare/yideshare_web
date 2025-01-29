import RideCard from './components/ride-card';
import type { Ride } from './types/main';

export default function Home() {
  const testRide: Ride = {
    id: '1', 
    beginning: 'A',
    destination: 'B', 
    date: '2021-10-10', 
    startTime: '10:00'};
  
  return (
    <div>
      <h1>Hello World</h1>
      <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
        <RideCard ride={testRide} />
        <RideCard ride={testRide} />
        <RideCard ride={testRide} />
        <RideCard ride={testRide} />
      </div>
    </div>
  );
}
