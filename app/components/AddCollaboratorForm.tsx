'use client';

import { useState } from 'react';
import { MdPersonAdd, MdEmail } from 'react-icons/md';

interface AddCollaboratorFormProps {
  dogId: string;
  onCollaboratorAdded: () => void;
}

export default function AddCollaboratorForm({ dogId, onCollaboratorAdded }: AddCollaboratorFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Editor' | 'Viewer'>('Viewer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/dogs/${dogId}/collaborators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add collaborator');
      }

      // Success!
      setEmail('');
      setRole('Viewer');
      onCollaboratorAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add collaborator');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
        <MdPersonAdd className="text-3xl" />
        Add Collaborator
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MdEmail className="inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="collaborator@example.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'Editor' | 'Viewer')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          >
            <option value="Viewer">Viewer (Read-only access)</option>
            <option value="Editor">Editor (Can add and edit data)</option>
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {role === 'Editor' 
              ? 'Editors can add and modify records like potty logs, weight, and tasks.'
              : 'Viewers can only view the dog\'s information and records.'}
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Adding...
            </>
          ) : (
            <>
              <MdPersonAdd />
              Add Collaborator
            </>
          )}
        </button>
      </form>
    </div>
  );
}
