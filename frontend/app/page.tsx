'use client';

import Link from 'next/link';
import { fetchDogs } from './lib/fetchDogs';
import { useEffect, useState } from 'react';

// Updated to use whoAmI instead of me
async function fetchUserName(): Promise<string> {
  if (typeof window === 'undefined') return 'visitor';
  const token = localStorage.getItem('accessToken');
  if (!token) return 'visitor';

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
            whoAmI {
              name
              email
            }
          }
        `,
      }),
    });
    const json = await res.json();
    const name = json.data?.whoAmI?.name;
    const email = json.data?.whoAmI?.email;
    return name || (email ? email.split('@')[0] : 'user');
  } catch {
    return 'user';
  }
}

export default function Page() {
  const [userName, setUserName] = useState('visitor');
  const [dogs, setDogs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserName().then(setUserName);
    fetchDogs()
      .then(data => setDogs(data.userDogs ?? []))
      .catch(() => setError('Could not fetch dogs from backend.'));
  }, []);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUserName('visitor');
    window.location.reload();
  }

  const isSignedIn = userName !== 'visitor';

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-indigo-100 flex flex-col items-center p-8">
      <header className="w-full max-w-3xl mb-10 text-center">
        <img 
          src="/doglog-logo.png"
          alt="Dog Log Logo"
          className="mx-auto mb-4 h-36 w-36 rounded-full shadow-lg"
        />
        <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-lg mb-2">Dog Log</h1>
        <p className="text-xl text-gray-700 mb-2">
          Hi <span className="font-semibold text-indigo-600">{userName}</span>!
        </p>
        <p className="text-xl text-gray-700 mb-4">
          Your all-in-one dog care and tracking app.
        </p>
        <div className="flex justify-center gap-4 mt-4 mb-4">
          {!isSignedIn && (
            <>
              <Link href="/signup" className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition">Sign Up</Link>
              <Link href="/signin" className="px-6 py-2 rounded-full bg-blue-400 text-white font-semibold shadow hover:bg-blue-500 transition">Sign In</Link>
            </>
          )}
          {isSignedIn && (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
            >
              Log Out
            </button>
          )}
          <Link href="/forum" className="px-6 py-2 rounded-full bg-yellow-400 text-white font-semibold shadow hover:bg-yellow-500 transition">Forum</Link>
        </div>
      </header>

      {/* Only show these sections if signed in */}
      {isSignedIn && (
        <>
          <section className="w-full max-w-3xl mb-8 flex flex-wrap justify-center gap-4">
            <Link href="/dogs" className="px-6 py-4 rounded-xl bg-indigo-100 text-indigo-700 font-bold shadow hover:bg-indigo-200 transition w-48 text-center">
              View All Dogs
            </Link>
            <Link href="/add-dog" className="px-6 py-4 rounded-xl bg-green-100 text-green-700 font-bold shadow hover:bg-green-200 transition w-48 text-center">
              Add Dog
            </Link>
          </section>

          <section className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Link href="/needs" className="flex flex-col items-center px-6 py-6 rounded-2xl bg-indigo-50 shadow hover:bg-indigo-100 transition">
              <span className="text-3xl mb-2">💩</span>
              <span className="font-bold text-indigo-700 mb-1">Report Needs</span>
              <span className="text-gray-600 text-sm">Track your dog's potty breaks</span>
            </Link>
            <Link href="/vaccinations" className="flex flex-col items-center px-6 py-6 rounded-2xl bg-green-50 shadow hover:bg-green-100 transition">
              <span className="text-3xl mb-2">💉</span>
              <span className="font-bold text-green-700 mb-1">Report Vaccination</span>
              <span className="text-gray-600 text-sm">Log vaccinations and medication</span>
            </Link>
            <Link href="/notifications" className="flex flex-col items-center px-6 py-6 rounded-2xl bg-yellow-50 shadow hover:bg-yellow-100 transition">
              <span className="text-3xl mb-2">🔔</span>
              <span className="font-bold text-yellow-700 mb-1">View Notifications</span>
              <span className="text-gray-600 text-sm">See reminders and alerts</span>
            </Link>
            <Link href="/tasks" className="flex flex-col items-center px-6 py-6 rounded-2xl bg-pink-50 shadow hover:bg-pink-100 transition">
              <span className="text-3xl mb-2">📝</span>
              <span className="font-bold text-pink-700 mb-1">Task List</span>
              <span className="text-gray-600 text-sm">Manage your dog's tasks</span>
            </Link>
          </section>

          <section className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">Your Dogs</h2>
            {error ? (
              <div className="text-red-500 font-semibold">{error}</div>
            ) : dogs.length === 0 ? (
              <div className="text-gray-600">
                No dogs found. <Link href="/add-dog" className="text-indigo-500 underline font-semibold">Add a dog</Link>
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dogs.map(dog => (
                  <li key={dog._id} className="bg-indigo-50 rounded-xl p-6 shadow flex flex-col items-start">
                    <span className="text-2xl font-bold text-indigo-700 mb-2">{dog.name}</span>
                    <span className="text-sm text-gray-700 mb-1">
                      <strong>Breed:</strong> {dog.breed?.join(', ') || 'Unknown breed'}
                    </span>
                    <span className="text-sm text-gray-700 mb-1">
                      <strong>Born:</strong> {dog.birthday ? new Date(dog.birthday).toLocaleDateString() : 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-700 mb-1">
                      <strong>Gender:</strong> {dog.gender || 'Unknown'}
                    </span>
                    {dog.imageUrl && (
                      <img
                        src={dog.imageUrl}
                        alt={dog.name}
                        className="mt-3 w-24 h-24 object-cover rounded-full border-2 border-indigo-300 shadow"
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {/* Quick Info section is always visible */}
      <section className="w-full max-w-3xl bg-gradient-to-r from-indigo-200 via-white to-blue-200 rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">Quick Info</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-lg text-gray-700">
          <li>✅ Track vaccinations, medication, and needs</li>
          <li>⏰ Get reminders for walks and treatments</li>
          <li>📄 Document medical records and export for vets</li>
          <li>👨‍👩‍👧‍👦 Share dog info with family or trainers</li>
          <li>🐕 Breed-specific tips and tracking</li>
        </ul>
      </section>
    </main>
  );
}