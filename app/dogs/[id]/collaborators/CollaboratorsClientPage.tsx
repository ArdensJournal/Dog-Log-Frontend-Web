'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MdArrowBack, MdPets } from 'react-icons/md';
import AddCollaboratorForm from '@/app/components/AddCollaboratorForm';
import CollaboratorsList from '@/app/components/CollaboratorsList';
import { DogModel } from '@/app/lib/definitions';

interface CollaboratorsClientPageProps {
  dog: DogModel;
}

export default function CollaboratorsClientPage({ dog: initialDog }: CollaboratorsClientPageProps) {
  const [dog, setDog] = useState<DogModel>(initialDog);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    // Trigger a re-fetch by incrementing the key
    setRefreshKey(prev => prev + 1);
    // In a real app, you'd want to fetch the updated dog data here
    // For now, we'll rely on the server actions to update the data
    window.location.reload();
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <Link
            href="/dogs"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-4 transition"
          >
            <MdArrowBack />
            Back to Dogs
          </Link>

          <div className="flex items-center gap-4">
            {dog.imageUrl ? (
              <img
                src={dog.imageUrl}
                alt={dog.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-300 dark:border-indigo-600 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center border-4 border-indigo-300 dark:border-indigo-600">
                <MdPets className="text-4xl text-indigo-600 dark:text-indigo-300" />
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
                Manage Collaborators
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                for <span className="font-semibold">{dog.name}</span>
              </p>
            </div>
          </div>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Share access to {dog.name}'s profile with family members, vets, or caretakers. 
            Choose their permission level carefully.
          </p>
        </div>

        {/* Add Collaborator Form */}
        <AddCollaboratorForm 
          dogId={dog._id} 
          onCollaboratorAdded={handleRefresh}
        />

        {/* Collaborators List */}
        <CollaboratorsList 
          dogId={dog._id}
          collaborators={dog.collaborators || []}
          onCollaboratorRemoved={handleRefresh}
        />
      </div>
    </main>
  );
}
