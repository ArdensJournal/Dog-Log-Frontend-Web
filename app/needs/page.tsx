import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/actions/auth';
import { getUserDogs } from '@/app/lib/actions/dogs';
import { getPottyRecords } from '@/app/lib/actions/potty';
import NeedsClientPage from './NeedsClientPage';

export default async function NeedsPage() {
  try {
    // Server-side data fetching
    console.log('NeedsPage: Starting data fetch...');
    const user = await getCurrentUser();
    console.log('NeedsPage: User:', user ? 'Found' : 'None');
    
    if (!user) {
      redirect('/signin');
    }

    const dogs = await getUserDogs();
    console.log('NeedsPage: Dogs count:', dogs.length);
    
    if (dogs.length === 0) {
      redirect('/add-dog');
    }

    // Get potty records for the first dog (default selection)
    const defaultDog = dogs[0];
    console.log('NeedsPage: Default dog:', defaultDog.name);
    const initialPottyRecords = await getPottyRecords(defaultDog._id);
    console.log('NeedsPage: Potty records count:', initialPottyRecords.length);

    return (
      <NeedsClientPage 
        user={user}
        dogs={dogs}
        defaultDog={defaultDog}
        initialPottyRecords={initialPottyRecords}
      />
    );
  } catch (error) {
    console.error('NeedsPage error:', error);
    
    // Return an error page instead of crashing
    return (
      <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Go Home
          </a>
        </div>
      </div>
    );
  }
}
