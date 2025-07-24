'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddDogPage() {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('You must be signed in to add a dog.');
      setLoading(false);
      return;
    }

    let imageUrl = null;
    if (image) {
      // Upload image first
      const formData = new FormData();
      formData.append('operations', JSON.stringify({
        query: `
          mutation UploadFile($body: CreateFileDto!) {
            uploadFile(body: $body)
          }
        `,
        variables: {
          body: { image: null }
        }
      }));
      formData.append('map', JSON.stringify({ "1": ["variables.body.image"] }));
      formData.append('1', image);

      try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        const json = await res.json();
        imageUrl = json.data?.uploadFile || null;
      } catch {
        setError('Failed to upload image.');
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation AddDog($createDogDto: CreateDogDto!) {
              createDog(createDogDto: $createDogDto) {
                _id
                name
              }
            }
          `,
          variables: {
            createDogDto: {
              name,
              breed: breed ? [breed] : [],
              birthday: birthday || null,
              gender: gender || null,
              image: imageUrl,
            }
          }
        }),
      });

      const json = await res.json();
      if (json.errors) {
        setError(json.errors[0]?.message || 'Failed to add dog.');
      } else {
        router.push('/dogs');
      }
    } catch (err) {
      setError('Failed to add dog.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 text-center">Add a New Dog</h1>
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
          <input
            type="file"
            accept="image/*"
            onChange={e => setImage(e.target.files?.[0] || null)}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-2 rounded-lg shadow hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Dog'}
          </button>
          {error && <div className="text-red-500 text-center">{error}</div>}
        </form>
      </div>
    </main>
  );
}