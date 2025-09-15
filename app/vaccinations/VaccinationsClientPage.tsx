'use client';

import { useState, useEffect, useTransition } from 'react';
import { getVaccinations, createVaccination } from '@/app/lib/actions/vaccinations';
import { type Dog, type Vaccine } from '@/app/lib/api-client';
import { MdVaccines, MdPets, MdAdd, MdClose, MdAssessment } from 'react-icons/md';

// --- Types ---
type VaccinationRecord = {
  _id: string;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  vaccine: Vaccine | string;
  validFor?: { unit: string; value: number };
};

interface VaccinationsClientPageProps {
  user: any;
  dogs: Dog[];
  vaccines: Vaccine[];
}

export default function VaccinationsClientPage({ user, dogs, vaccines }: VaccinationsClientPageProps) {
  const [selectedDog, setSelectedDog] = useState<Dog | null>(dogs[0] || null);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [isLoadingVaccinations, setIsLoadingVaccinations] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vaccine: "", date: "", note: "" });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load vaccinations for selected dog
  useEffect(() => {
    if (selectedDog) {
      loadVaccinations();
    } else {
      setVaccinations([]);
    }
  }, [selectedDog]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showForm) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showForm]);

  const loadVaccinations = async () => {
    if (!selectedDog) return;
    
    setIsLoadingVaccinations(true);
    startTransition(async () => {
      try {
        const records = await getVaccinations(selectedDog._id);
        setVaccinations(records);
      } catch (error) {
        console.error('Failed to fetch vaccinations:', error);
        setError('Failed to load vaccinations');
      } finally {
        setIsLoadingVaccinations(false);
      }
    });
  };

  const handleCreateVaccination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDog || !form.vaccine) return;

    startTransition(async () => {
      try {
        setError(null);
        await createVaccination({
          dogId: selectedDog._id,
          vaccineId: form.vaccine,
          dateGiven: form.date,
          notes: form.note
        });

        // Reload vaccinations
        await loadVaccinations();
        
        // Reset form and close modal
        setForm({ vaccine: "", date: "", note: "" });
        setShowForm(false);
      } catch (error: any) {
        setError(error.message || 'Failed to create vaccination record');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                <MdVaccines className="text-4xl text-purple-600" />
                Vaccination Records
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and manage your dog's vaccination history
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
                        onClick={() => setSelectedDog(dog)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                          selectedDog?._id === dog._id
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-600 hover:text-purple-600'
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
                    onClick={() => setShowForm(true)}
                    disabled={isPending}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 text-lg disabled:opacity-50"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MdAdd className="text-xl" />
                    </div>
                    Add Vaccination
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
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Vaccination Form Modal */}
        {showForm && selectedDog && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false);
              }
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300"
              >
                <MdClose className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Add Vaccination for {selectedDog.name}
              </h3>
              
              <form onSubmit={handleCreateVaccination} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vaccine
                  </label>
                  <select
                    value={form.vaccine}
                    onChange={(e) => setForm({ ...form, vaccine: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Select a vaccine...</option>
                    {vaccines.map((vaccine) => (
                      <option key={vaccine._id} value={vaccine._id}>
                        {vaccine.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Any additional notes..."
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                  >
                    {isPending ? 'Adding...' : 'Add Vaccination'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vaccinations List */}
        {selectedDog && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <MdAssessment className="text-purple-600" />
              {selectedDog.name}'s Vaccination History
            </h2>
            
            {isLoadingVaccinations ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Loading vaccinations...
              </div>
            ) : vaccinations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No vaccination records found for {selectedDog.name}.
              </div>
            ) : (
              <div className="space-y-3">
                {vaccinations.map((vaccination) => (
                  <div
                    key={vaccination._id}
                    className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {typeof vaccination.vaccine === 'string' ? vaccination.vaccine : vaccination.vaccine.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Date: {new Date(vaccination.date).toLocaleDateString()}
                        </p>
                        {vaccination.note && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Note: {vaccination.note}
                          </p>
                        )}
                        {vaccination.validFor && (
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Valid for: {vaccination.validFor.value} {vaccination.validFor.unit}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No dogs state */}
        {dogs.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🐕</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Dogs Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to add a dog before you can track vaccinations.
            </p>
            <a
              href="/add-dog"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Add Your First Dog
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
