'use client';

import { useState } from 'react';
import { MdPeople, MdDelete, MdEdit, MdVisibility, MdEmail, MdPerson } from 'react-icons/md';
import { CollaboratorRoleModel } from '@/app/lib/definitions';

interface CollaboratorsListProps {
  dogId: string;
  collaborators: CollaboratorRoleModel[];
  onCollaboratorRemoved: () => void;
}

export default function CollaboratorsList({ dogId, collaborators, onCollaboratorRemoved }: CollaboratorsListProps) {
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async (collaboratorUserId: string, collaboratorEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${collaboratorEmail} as a collaborator?`)) {
      return;
    }

    setError(null);
    setRemovingId(collaboratorUserId);

    try {
      const response = await fetch(`/api/dogs/${dogId}/collaborators/${collaboratorUserId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove collaborator');
      }

      // Success!
      onCollaboratorRemoved();
    } catch (err: any) {
      setError(err.message || 'Failed to remove collaborator');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 flex items-center gap-2">
        <MdPeople className="text-3xl" />
        Current Collaborators ({collaborators.length})
      </h2>

      {error && (
        <div className="mb-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {collaborators.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MdPeople className="mx-auto text-6xl mb-3 opacity-30" />
          <p>No collaborators yet.</p>
          <p className="text-sm mt-2">Add someone to share access to this dog's profile!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {collaborators.map((collaborator) => (
            <li
              key={collaborator.user._id}
              className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                {collaborator.user.profileImageUrl ? (
                  <img
                    src={collaborator.user.profileImageUrl}
                    alt={collaborator.user.name || collaborator.user.email}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-300 dark:border-indigo-600"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center">
                    <MdPerson className="text-2xl text-indigo-600 dark:text-indigo-300" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {collaborator.user.name && (
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {collaborator.user.name}
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        collaborator.role === 'Editor'
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {collaborator.role === 'Editor' ? (
                        <>
                          <MdEdit className="text-sm" /> Editor
                        </>
                      ) : (
                        <>
                          <MdVisibility className="text-sm" /> Viewer
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <MdEmail className="text-base" />
                    {collaborator.user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRemove(collaborator.user._id, collaborator.user.email)}
                disabled={removingId === collaborator.user._id}
                className="ml-4 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg shadow transition flex items-center gap-1"
                title="Remove collaborator"
              >
                {removingId === collaborator.user._id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <MdDelete />
                    Remove
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">About Roles:</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li className="flex items-start gap-2">
            <MdEdit className="mt-0.5 flex-shrink-0" />
            <span><strong>Editor:</strong> Can add and modify records (potty logs, weight, vaccinations, tasks)</span>
          </li>
          <li className="flex items-start gap-2">
            <MdVisibility className="mt-0.5 flex-shrink-0" />
            <span><strong>Viewer:</strong> Can only view the dog's profile and records (read-only access)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
