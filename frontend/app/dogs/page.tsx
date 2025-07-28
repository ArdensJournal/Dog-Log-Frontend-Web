'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

async function fetchUserDogs() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) return [];
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            userDogs {
              _id
              name
              breed
              birthday
              gender
              imageUrl
              collaborators {
                role
                user {
                  _id
                  name
                  email
                }
              }
            }
          }
        `,
      }),
    });
    const json = await res.json();
    return json.data?.userDogs || [];
  } catch {
    return [];
  }
}

export default function DogsPage() {
  const [dogs, setDogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDogs().then(dogs => {
      setDogs(dogs);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">All Dogs</h1>
        <p className="text-gray-600 mb-6 text-center">This is where you will see all registered dogs.</p>
        <Link href="/add-dog" className="bg-green-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-green-600 transition mx-auto block w-fit">
          Add Dog
        </Link>
        <div className="mt-8">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : dogs.length === 0 ? (
            <div className="text-center text-gray-500">No dogs found.</div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dogs.map(dog => (
                <li key={dog._id} className="bg-indigo-50 rounded-xl p-6 shadow flex flex-col items-start">
                  <span className="text-2xl font-bold text-indigo-700 mb-2">{dog.name}</span>
                  <span className="text-sm text-gray-700 mb-1">
                    <strong>Breed:</strong> {Array.isArray(dog.breed) ? dog.breed.join(', ') : dog.breed || 'Unknown'}
                  </span>
                  <span className="text-sm text-gray-700 mb-1">
                    <strong>Born:</strong> {dog.birthday ? new Date(dog.birthday).toLocaleDateString() : 'Unknown'}
                  </span>
                  <span className="text-sm text-gray-700 mb-1">
                    <strong>Gender:</strong> {dog.gender || 'Unknown'}
                  </span>
                  {dog.imageUrl ? (
                    <img
                      src={dog.imageUrl}
                      alt={dog.name}
                      className="mt-3 w-24 h-24 object-cover rounded-full border-2 border-indigo-300 shadow"
                    />
                  ) : (
                    <span className="mt-3 w-24 h-24 flex items-center justify-center rounded-full border-2 border-indigo-200 bg-indigo-100 text-indigo-400 text-xs">
                      No photo available
                    </span>
                  )}
                  <div className="mt-2 text-sm text-gray-700">
                    <strong>Collaborators:</strong>
                    {dog.collaborators && dog.collaborators.length > 0 ? (
                      <ul className="list-disc ml-5">
                        {dog.collaborators.map((col: any, idx: number) => (
                          <li key={idx}>
                            {col.user.name || col.user.email} ({col.role})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span> None</span>
                    )}
                  </div>
                  <Link
                    href={`/dogs/${dog._id}/edit`}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    Edit
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}