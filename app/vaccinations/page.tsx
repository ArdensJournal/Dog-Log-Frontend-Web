"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuthStatus } from "@/app/lib/auth";
import { apiClient, type Dog, type Vaccine, type DogWithVaccinations, type Vaccination } from "@/app/lib/api-client";

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

  // --- Auth ---
  useEffect(() => { checkAuth(); }, []);
  const checkAuth = async () => {
    setAuthLoading(true);
    try {
      const authenticatedUser = await checkAuthStatus();
      setUser(authenticatedUser.isAuthenticated ? authenticatedUser.user : null);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // --- Load Dogs ---
  useEffect(() => { if (user && !authLoading) loadDogs(); }, [user, authLoading]);
  const loadDogs = async () => {
    if (!user) return;
    setIsLoadingDogs(true);
    try {
      const result = await (await import("@/app/lib/api-client")).apiClient.getDogs();
      const fetchedDogs = result.data?.userDogs || [];
      setDogs(fetchedDogs);
      if (fetchedDogs.length > 0 && !selectedDog) setSelectedDog(fetchedDogs[0]);
    } catch {
      setError("Failed to load your dogs. Please try signing in again.");
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!user) {
    router.push("/signin");
    return null;
  }
  if (dogs.length === 0 && !isLoadingDogs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-8xl mb-6">🐕</div>
          <h1 className="text-3xl font-bold mb-4">No Dogs Found</h1>
          <p className="mb-6">You need to add a dog before you can track vaccinations.</p>
          <button onClick={() => router.push("/add-dog")} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl">Add Your First Dog</button>
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
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 shadow-lg" title="Close form (Esc)">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Vaccination Record</h3>
                <form onSubmit={handleAddVaccination} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Vaccine *</label>
                    <select
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={form.vaccine}
                      onChange={e => setForm(f => ({ ...f, vaccine: e.target.value }))}
                      required
                    >
                      <option value="">Select a vaccine</option>
                      {vaccines.map(v => (
                        <option key={v._id} value={v._id}>{v.name}</option>
                      ))}
                    </select>
                    {vaccines.length === 0 && (
                      <p className="text-xs text-red-500 mt-1">No vaccines available. Contact your admin to add vaccines to the system.</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Available vaccines: {vaccines.length}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Valid For *</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        className="w-20 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={form.validForValue}
                        onChange={e => setForm(f => ({ ...f, validForValue: Number(e.target.value) }))}
                        required
                      />
                      <select
                        className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      value={form.note}
                      onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" disabled={isSaving}>Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50" disabled={isSaving}>{isSaving ? "Saving..." : "Add Record"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Vaccination History */}
        {selectedDog && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Vaccination History</h2>
            {isLoadingVaccinations ? (
              <div className="text-center text-gray-500 dark:text-gray-400">Loading records...</div>
            ) : vaccinations.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-gray-500">No vaccination records found for this dog.</div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {vaccinations.map(vax => (
                  <li key={vax._id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {typeof vax.vaccine === 'string' ? (vaccines.find(v => v._id === vax.vaccine)?.name || vax.vaccine) : vax.vaccine?.name || ''}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">{new Date(vax.date).toLocaleDateString()}</div>
                      {vax.note && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{vax.note}</div>}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 md:text-right">Added: {new Date(vax.createdAt).toLocaleDateString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
