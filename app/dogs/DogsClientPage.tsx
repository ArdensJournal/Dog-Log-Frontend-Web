'use client';

import Link from 'next/link';
import { useState, useTransition, useEffect } from 'react';
import { deleteDog } from '@/app/lib/actions/dogs';
import { Dog } from '@/app/lib/api-client';

interface DogsClientPageProps {
  dogs: Dog[];
}

// Cache for location names to avoid repeated API calls
const locationCache = new Map<string, string>();

export default function DogsClientPage({ dogs: initialDogs }: DogsClientPageProps) {
  const [dogs, setDogs] = useState<Dog[]>(initialDogs);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [locationNames, setLocationNames] = useState<Map<string, string>>(new Map());

  // Fetch location names for all dogs with coordinates
  useEffect(() => {
    const fetchLocationNames = async () => {
      const newLocationNames = new Map<string, string>();
      
      for (const dog of dogs) {
        if (dog.houseCoordinates) {
          const { latitude, longitude } = dog.houseCoordinates;
          const cacheKey = `${latitude},${longitude}`;
          
          // Check cache first
          if (locationCache.has(cacheKey)) {
            newLocationNames.set(dog._id, locationCache.get(cacheKey)!);
            continue;
          }
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            const address = data.address || {};
            const parts = [
              address.road || address.pedestrian || address.path,
              address.city || address.town || address.village,
              address.state,
              address.country
            ].filter(Boolean);
            
            const name = parts.length > 0 ? parts.join(', ') : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            locationCache.set(cacheKey, name);
            newLocationNames.set(dog._id, name);
            
            // Add small delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (err) {
            console.error('Error reverse geocoding:', err);
            const fallback = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            newLocationNames.set(dog._id, fallback);
          }
        }
      }
      
      setLocationNames(newLocationNames);
    };
    
    fetchLocationNames();
  }, [dogs]);

  const handleDeleteDog = async (dogId: string, dogName: string) => {
    if (!confirm(`Are you sure you want to delete ${dogName}? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(dogId);
    startTransition(async () => {
      try {
        console.log('🗑️ Attempting to delete dog:', dogId, dogName);
        await deleteDog(dogId);
        console.log('✅ Delete successful');
        // Remove the deleted dog from the local state
        setDogs(prevDogs => prevDogs.filter(dog => dog._id !== dogId));
      } catch (error) {
        console.error('❌ Delete error:', error);
        alert(`Failed to delete ${dogName}. Please try again.`);
        console.error('Delete error:', error);
      } finally {
        setDeleteLoading(null);
      }
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-8">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6 text-center">All Dogs</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">This is where you will see all registered dogs.</p>
        <Link href="/add-dog" className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg shadow transition mx-auto block w-fit">
          Add Dog
        </Link>
        <div className="mt-8">
          {dogs.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">No dogs found.</div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dogs.map(dog => (
                <li key={dog._id} className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 shadow flex flex-col items-start">
                  <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">{dog.name}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <strong>Breed:</strong> {dog.breeds?.join(', ') || 'Unknown'}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <strong>Born:</strong> {dog.birthday ? new Date(dog.birthday).toLocaleDateString() : 'Unknown'}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <strong>Gender:</strong> {dog.gender || 'Unknown'}
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <strong>Location:</strong> {dog.houseCoordinates 
                      ? (locationNames.get(dog._id) || 'Loading location...') 
                      : 'No location set'}
                  </span>
                  {dog.imageUrl ? (
                    <img
                      src={dog.imageUrl}
                      alt={dog.name}
                      className="mt-3 w-24 h-24 object-cover rounded-full border-2 border-indigo-300 dark:border-indigo-600 shadow"
                    />
                  ) : (
                    <span className="mt-3 w-24 h-24 flex items-center justify-center rounded-full border-2 border-indigo-200 dark:border-indigo-700 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-400 dark:text-indigo-500 text-xs">
                      No photo available
                    </span>
                  )}
                  
                  {/* Action buttons */}
                  <div className="mt-4 flex flex-col gap-2 w-full">
                    <div className="flex gap-2">
                      <Link
                        href={`/dogs/${dog._id}/edit`}
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteDog(dog._id, dog.name)}
                        disabled={deleteLoading === dog._id || isPending}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg shadow transition"
                      >
                        {deleteLoading === dog._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                    <Link
                      href={`/dogs/${dog._id}/collaborators`}
                      className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow transition text-center"
                    >
                      Manage Collaborators
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
