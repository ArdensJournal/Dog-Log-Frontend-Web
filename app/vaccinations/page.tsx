'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/app/lib/auth';
import { apiClient, type Dog, type Vaccine, type DogWithVaccinations, type Vaccination } from '@/app/lib/api-client';

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

export default function VaccinationsPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [isLoadingDogs, setIsLoadingDogs] = useState(false);
  const [isLoadingVaccinations, setIsLoadingVaccinations] = useState(false);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vaccine: "", date: "", note: "", validForValue: 12, validForUnit: "Months" });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showForm) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showForm]);

  // Load user authentication
  useEffect(() => {
    checkAuth();
  }, []);

  // Load dogs when user is authenticated
  useEffect(() => {
    if (user && !authLoading) {
      loadDogs();
    }
  }, [user, authLoading]);

  // Load vaccines and vaccinations when dog is selected
  useEffect(() => {
    if (selectedDog) {
      fetchVaccinations();
    } else {
      setVaccinations([]);
    }
  }, [selectedDog]);

  // Load vaccines on mount
  useEffect(() => {
    fetchVaccines();
  }, []);

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const authenticatedUser = await checkAuthStatus();
      setUser(authenticatedUser.isAuthenticated ? authenticatedUser.user : null);
      
      console.log('Auth check result:', {
        isAuthenticated: authenticatedUser.isAuthenticated,
        user: authenticatedUser.user
      });
      
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadDogs = async () => {
    if (!user) {
      console.log('No authenticated user, skipping dog loading');
      return;
    }

    try {
      setIsLoadingDogs(true);
      setError(null);
      console.log('Loading dogs for user:', user);
      
      const result = await apiClient.getDogs();
      const fetchedDogs = result.data?.userDogs || [];
      console.log('Fetched dogs response:', fetchedDogs);
      
      setDogs(fetchedDogs);
      
      // Auto-select first dog if available
      if (fetchedDogs && fetchedDogs.length > 0 && !selectedDog) {
        setSelectedDog(fetchedDogs[0]);
      }
    } catch (error) {
      console.error('Error loading dogs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to load your dogs: ${errorMessage}. Please try signing in again.`);
    } finally {
      setIsLoadingDogs(false);
    }
  };

  // --- Load Vaccines ---
  useEffect(() => { fetchVaccines(); }, []);
  const fetchVaccines = async () => {
    console.log('Fetching vaccines...');
    try {
      const result = await apiClient.getVaccines();
      console.log('Vaccines response:', result);
      console.log('Vaccines list:', result.data?.findAllVaccines);
      console.log('Individual vaccines:', result.data?.findAllVaccines?.map((v: any) => ({ id: v._id, name: v.name })));
      
      // Remove duplicates by name and keep only the first occurrence
      const uniqueVaccines = [];
      const seenNames = new Set();
      
      for (const vaccine of (result.data?.findAllVaccines || [])) {
        if (!seenNames.has(vaccine.name)) {
          seenNames.add(vaccine.name);
          uniqueVaccines.push(vaccine);
        }
      }
      
      console.log('Unique vaccines after deduplication:', uniqueVaccines.map((v: any) => ({ id: v._id, name: v.name })));
      
      const vaccinesList = result.data?.findAllVaccines || [];
      
      // If no vaccines exist, create them via the seed endpoint
      if (vaccinesList.length === 0) {
        console.log('No vaccines found, seeding default vaccines...');
        await fetch('/api/seed-vaccines');
        // Refetch after seeding
        const newResult = await apiClient.getVaccines();
        setVaccines(uniqueVaccines);
      } else {
        // Remove duplicates by name and keep only the first occurrence
        const uniqueVaccines = [];
        const seenNames = new Set();
        
        for (const vaccine of vaccinesList) {
          if (!seenNames.has(vaccine.name)) {
            seenNames.add(vaccine.name);
            uniqueVaccines.push(vaccine);
          }
        }
        
        setVaccines(uniqueVaccines);
      }
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      setVaccines([]);
    }
  };

  // --- Load Vaccination Records ---
  useEffect(() => { if (selectedDog) fetchVaccinations(); else setVaccinations([]); }, [selectedDog]);
  const fetchVaccinations = async () => {
    if (!selectedDog) return;
    setIsLoadingVaccinations(true);
    try {
      const result = await apiClient.getVaccinations();
      const dogsWithVaccinations = result.data?.userDogs || [];
      
      // Find the selected dog's vaccinations
      const currentDog = dogsWithVaccinations.find((dog: DogWithVaccinations) => dog._id === selectedDog._id);
      const vaccinationRecords = currentDog?.vaccinations || [];
      
      // Map the new structure to the old structure for compatibility
      const mappedVaccinations: VaccinationRecord[] = vaccinationRecords.map((v: Vaccination) => ({
        _id: v._id,
        date: v.dateGiven,
        note: v.notes,
        createdAt: v.createdAt,
        updatedAt: v.createdAt, // API doesn't have updatedAt, using createdAt
        vaccine: v.vaccine,
        validFor: undefined // Not available in new structure
      }));
      
      setVaccinations(mappedVaccinations);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
      setVaccinations([]);
    } finally {
      setIsLoadingVaccinations(false);
    }
  };

  // --- Add Vaccination ---
  const handleAddVaccination = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await apiClient.createVaccination({
        dogId: selectedDog!._id,
        vaccineId: form.vaccine,
        dateGiven: new Date(form.date).toISOString(),
        notes: form.note,
        administeredBy: undefined, // Not captured in current form
        nextDueDate: undefined, // Not captured in current form
      });
      setShowForm(false);
      setForm({ vaccine: "", date: "", note: "", validForValue: 12, validForUnit: "Months" });
      fetchVaccinations();
    } catch (err: any) {
      setError(err?.message || "Failed to add vaccination record.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- UI States ---
  if (authLoading || isLoadingDogs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/signin");
    return null;
  }

  if (dogs.length === 0 && !isLoadingDogs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-8xl mb-6">�</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              No Dogs Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You need to add a dog before you can track vaccinations. Let's get started!
            </p>
            <button
              onClick={() => router.push('/add-dog')}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Add Your First Dog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-red-900 dark:to-pink-900 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                <span className="text-4xl">💉</span>
                Vaccination Records
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Track your dog's vaccinations and keep them healthy</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {dogs.length > 1 && (
                <select
                  value={selectedDog?._id || ''}
                  onChange={e => setSelectedDog(dogs.find(d => d._id === e.target.value) || null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 min-w-48"
                >
                  {dogs.map(dog => (
                    <option key={dog._id} value={dog._id}>🐕 {dog.name}</option>
                  ))}
                </select>
              )}
              <button
                onClick={() => setShowForm(true)}
                disabled={!selectedDog}
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-lg">➕</span>
                Add Vaccination
              </button>
            </div>
          </div>
          {selectedDog && (
            <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedDog.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{selectedDog.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDog.breed}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">❌</span>
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <button onClick={() => setError(null)} className="text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors mt-2">Dismiss</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Vaccination Modal */}
        {showForm && selectedDog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="max-w-md w-full max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setShowForm(false)} 
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 shadow-lg backdrop-blur-sm" 
                title="Close form (Esc)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                      💉
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Add Vaccination Record
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Record a new vaccination for {selectedDog.name}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleAddVaccination} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Vaccine Type *
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                        value={form.vaccine}
                        onChange={e => setForm(f => ({ ...f, vaccine: e.target.value }))}
                        required
                      >
                        <option value="">Select a vaccine...</option>
                        {vaccines.map(v => (
                          <option key={v._id} value={v._id}>{v.name}</option>
                        ))}
                      </select>
                      {vaccines.length === 0 && (
                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                          <span>⚠️</span>
                          No vaccines available. Contact your admin to add vaccines to the system.
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Vaccination Date *
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                        value={form.date}
                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Valid For *
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="number"
                          min={1}
                          className="w-24 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                          value={form.validForValue}
                          onChange={e => setForm(f => ({ ...f, validForValue: Number(e.target.value) }))}
                          required
                        />
                        <select
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                          value={form.validForUnit}
                          onChange={e => setForm(f => ({ ...f, validForUnit: e.target.value }))}
                          required
                        >
                          <option value="Days">Days</option>
                          <option value="Weeks">Weeks</option>
                          <option value="Months">Months</option>
                          <option value="Years">Years</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                      </label>
                      <textarea
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors resize-none"
                        value={form.note}
                        onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                        rows={3}
                        placeholder="Add any additional notes about this vaccination..."
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button 
                        type="button" 
                        onClick={() => setShowForm(false)} 
                        className="flex-1 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors duration-200" 
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg" 
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Saving...
                          </span>
                        ) : (
                          "Add Record"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vaccination History */}
        {selectedDog && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-3xl">📋</span>
                Vaccination History
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Complete vaccination record for {selectedDog.name}
              </p>
            </div>
            
            {isLoadingVaccinations ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading vaccination records...</p>
              </div>
            ) : vaccinations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Vaccinations Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Start tracking {selectedDog.name}'s vaccination history by adding the first record.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Add First Vaccination
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {vaccinations
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((vaccination) => (
                    <div key={vaccination._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              💉
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {typeof vaccination.vaccine === 'string' 
                                  ? (vaccines.find(v => v._id === vaccination.vaccine)?.name || vaccination.vaccine)
                                  : vaccination.vaccine?.name || 'Unknown Vaccine'
                                }
                              </h3>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                Given on {new Date(vaccination.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                          {vaccination.note && (
                            <div className="ml-13 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mt-3">
                              <p className="text-gray-700 dark:text-gray-300 text-sm">
                                <span className="font-medium">Notes: </span>
                                {vaccination.note}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                            ✓ Completed
                          </span>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            Added: {new Date(vaccination.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
