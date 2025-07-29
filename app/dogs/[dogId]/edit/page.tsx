'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

async function fetchDog(dogId: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) return null;
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query GetDog($dogId: ID!) {
            userDogs {
              _id
              name
              breed
              birthday
              gender
              imageUrl
            }
          }
        `,
      }),
    });
    const json = await res.json();
    if (!json.data?.userDogs) return null;
    return json.data.userDogs.find((d: any) => d._id === dogId) || null;
  } catch {
    return null;
  }
}

async function updateDog(dogId: string, data: any) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (!token) return { success: false, message: 'Not signed in' };
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation UpdateDog($updateDogDto: UpdateDogDto!) {
            updateDog(updateDogDto: $updateDogDto) {
              _id
              name
              breed
              birthday
              gender
              imageUrl
            }
          }
        `,
        variables: {
          updateDogDto: {
            dogId,
            name: data.name,
            breed: data.breed ? [data.breed] : [],
            birthday: data.birthday || null,
            gender: data.gender || null,
            // image: not handled here
          }
        }
      }),
    });
    const json = await res.json();
    if (json.errors && json.errors.length > 0) {
      return { success: false, message: json.errors[0].message };
    }
    return { success: true, dog: json.data?.updateDog };
  } catch {
    return { success: false, message: 'Failed to update dog.' };
  }
}

export default function EditDogPage() {
  const router = useRouter();
  const params = useParams();
  const dogId = typeof params?.dogId === 'string' ? params.dogId : Array.isArray(params?.dogId) ? params.dogId[0] : '';
  const [dog, setDog] = useState<any>(null);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dogId) return;
    fetchDog(dogId).then(d => {
      if (d) {
        setDog(d);
        setName(d.name || '');
        setBreed(Array.isArray(d.breed) ? d.breed[0] || '' : d.breed || '');
        setBirthday(d.birthday ? d.birthday.slice(0, 10) : '');
        setGender(d.gender || '');
      }
      setLoading(false);
    });
  }, [dogId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const result = await updateDog(dogId, { name, breed, birthday, gender });
    if (result.success) {
      router.push('/dogs');
    } else {
      setError(result.message || 'Failed to update dog.');
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100">
        <div className="text-gray-600 text-xl">Loading...</div>
      </main>
    );
  }

  if (!dog) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100">
        <div className="text-red-500 text-xl">Dog not found.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">Edit Dog</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Dog Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="text"
            placeholder="Breed"
            value={breed}
            onChange={e => setBreed(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-blue-700 transition"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
        <p className="mt-4 text-center text-gray-600">
          <Link href="/dogs" className="text-indigo-500 underline font-semibold">
            Back to All Dogs
          </Link>
        </p>
      </div>
    </main>
  );
}