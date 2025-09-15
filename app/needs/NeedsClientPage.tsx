'use client';

import { useState, useTransition } from 'react';
import { createPottyRecord, getPottyRecords } from '@/app/lib/actions/potty';
import { Dog } from '@/app/lib/api-client';
import { PottyRecord } from '@/app/lib/types/potty';
import PottyLogForm from '@/app/components/potty/PottyLogForm';
import PottyHistoryList from '@/app/components/potty/PottyHistoryList';
import { 
  MdPets, 
  MdAdd, 
  MdAssignment, 
  MdBarChart, 
  MdSchedule 
} from 'react-icons/md';

interface NeedsClientPageProps {
  user: any;
  dogs: Dog[];
  defaultDog: Dog;
  initialPottyRecords: PottyRecord[];
}

export default function NeedsClientPage({ 
  user, 
  dogs, 
  defaultDog, 
  initialPottyRecords 
}: NeedsClientPageProps) {
  const [selectedDog, setSelectedDog] = useState<Dog>(defaultDog);
  const [pottyRecords, setPottyRecords] = useState<PottyRecord[]>(initialPottyRecords);
  const [showLogForm, setShowLogForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogPotty = async (pottyData: any) => {
    startTransition(async () => {
      try {
        setError(null);
        const newRecord = await createPottyRecord({
          dogId: selectedDog._id,
          type: pottyData.type,
          environment: pottyData.location || pottyData.environment,
          notes: pottyData.notes || pottyData.note,
          date: pottyData.timestamp || pottyData.date || new Date().toISOString(),
          healthFlags: pottyData.healthFlags || [],
          coordinates: pottyData.coordinates || null
        });
        
        setPottyRecords(prev => [newRecord, ...prev]);
        setShowLogForm(false);
      } catch (err: any) {
        setError(err.message || 'Failed to log potty break');
      }
    });
  };

  const handleDogChange = async (dog: Dog) => {
    setSelectedDog(dog);
    startTransition(async () => {
      try {
        const records = await getPottyRecords(dog._id);
        setPottyRecords(records);
      } catch (err) {
        console.error('Failed to fetch potty records for dog:', err);
        setPottyRecords([]);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                <span className="text-4xl">🚽</span>
                Potty Tracking
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Keep track of your dog's bathroom habits and health
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Dog Selector */}
              {dogs.length > 1 && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Dog:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {dogs.map((dog) => (
                      <button
                        key={dog._id}
                        onClick={() => handleDogChange(dog)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          selectedDog?._id === dog._id
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-600 hover:text-green-600'
                        }`}
                      >
                        {dog.imageUrl ? (
                          <img
                            src={dog.imageUrl}
                            alt={dog.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <MdPets className="w-5 h-5" />
                        )}
                        {dog.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Button */}
              {selectedDog && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowLogForm(true)}
                    disabled={isPending}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 text-lg disabled:opacity-50"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MdAdd className="text-xl" />
                    </div>
                    {isPending ? 'Logging...' : 'Log Potty Break'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">❌</span>
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setError(null)}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Potty Log Form Modal */}
        {showLogForm && selectedDog && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              // Close modal if clicking on backdrop (not the modal content)
              if (e.target === e.currentTarget) {
                setShowLogForm(false);
              }
            }}
          >
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* X Close Button */}
              <button
                onClick={() => setShowLogForm(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors shadow-lg"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <PottyLogForm
                dogId={selectedDog._id}
                onSubmit={handleLogPotty}
                onCancel={() => setShowLogForm(false)}
              />
            </div>
          </div>
        )}

        {/* Potty History */}
        {selectedDog && (
          <PottyHistoryList
            records={pottyRecords}
            isLoading={isPending}
            onRefresh={() => handleDogChange(selectedDog)}
          />
        )}

        {/* No records state */}
        {selectedDog && pottyRecords.length === 0 && !isPending && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🐕</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Start Tracking {selectedDog.name}'s Potty Breaks
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Keep track of bathroom habits to monitor your dog's health and routine.
            </p>
            <button
              onClick={() => setShowLogForm(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Log First Potty Break
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
