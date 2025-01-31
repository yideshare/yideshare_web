import RideCard from './components/ride-card';
import SearchBar from './components/search-bar';
import type { Ride } from './types/main';
import { prisma } from '../lib/db';

export default async function Home() {
 
  const fetchedRides: Ride[] = await prisma.ride.findMany({
    take: 4,
  });

  return (
    <div>
      <h1 className='text-4xl mt-4 text-center'>Yide Your Y(W)ay</h1>
      <SearchBar />
      <div className='grid grid-cols-1 gap-4 max-w-lg mx-auto'>
        {fetchedRides.length > 0 ? (
          fetchedRides.map((ride) => <RideCard key={ride.id} {...ride} />)
        ) : (
          <p className='text-center text-red-500'>No rides available.</p>
        )}
      </div>
    </div>
  );
}
