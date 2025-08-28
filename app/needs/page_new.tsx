'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/app/lib/auth';
import { Dog } from '@/app/lib/api-client';
import { PottyRecord } from '@/app/lib/types/potty';
import { fetchDogs } from '@/app/lib/fetchDogs';
import PottyLogForm from '@/app/components/potty/PottyLogForm';
import PottyHistoryList from '@/app/components/potty/PottyHistoryList';

export default function NeedsPage() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [pottyRecords, setPottyRecords] = useState<PottyRecord[]>([]);
  const [isLoadingDogs, setIsLoadingDogs] = useState(false);
  const [isLoadingPotty, setIsLoadingPotty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  // Load potty records when dog is selected
  useEffect(() => {
    if (selectedDog) {
      loadPottyRecords();
    }
  }, [selectedDog]);

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const authenticatedUser = await checkAuthStatus();
      setUser(authenticatedUser.isAuthenticated ? authenticatedUser.user : null);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const loadDogs = async () => {
    try {
      setIsLoadingDogs(true);
      setError(null);
      const fetchedDogs = await fetchDogs();
      setDogs(fetchedDogs.userDogs || []);
      
      // Auto-select first dog if available
      if (fetchedDogs.userDogs && fetchedDogs.userDogs.length > 0 && !selectedDog) {
        setSelectedDog(fetchedDogs.userDogs[0]);
      }
    } catch (error) {
      console.error('Error loading dogs:', error);
      setError('Failed to load your dogs. Please try again.');
    } finally {
      setIsLoadingDogs(false);
    }
  };

  const loadPottyRecords = async () => {
    if (!selectedDog) return;

    try {
      setIsLoadingPotty(true);
      setError(null);
      // Note: This will be implemented when backend is connected
      setPottyRecords([]);
    } catch (error) {
      console.error('Error loading potty records:', error);
      setError('Failed to load potty records. Please try again.');
    } finally {
      setIsLoadingPotty(false);
    }
  };

  const handleLogPotty = async (pottyData: any) => {
    if (!selectedDog) return;

    try {
      setIsSaving(true);
      setError(null);
      
      // Create a demo record for now
      const newRecord: PottyRecord = {
        _id: 'temp-' + Date.now(),
        date: pottyData.date,
        type: pottyData.type,
        environment: pottyData.environment || 'OUTDOORS',
        healthFlags: pottyData.healthFlags,
        note: pottyData.note,
        coordinates: pottyData.coordinates,
        addedBy: {
          _id: user?.id || 'temp-user',
          name: user?.name || 'Demo User',
          email: user?.email || 'demo@example.com'
        },
        createdAt: new Date().toISOString()
      };
      
      // Add new record to the beginning of the list
      setPottyRecords(prev => [newRecord, ...prev]);
      setShowLogForm(false);
      
      console.log(`✅ ${pottyData.type === 'PEE' ? 'Pee' : 'Poop'} break logged successfully!`);
      
    } catch (error) {
      console.error('Error logging potty:', error);
      setError('Failed to log potty break. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle loading states
  if (authLoading || isLoadingDogs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!user) {
    router.push('/signin');
    return null;
  }

  // Handle no dogs case
  if (dogs.length === 0 && !isLoadingDogs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-8xl mb-6">🐕</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              No Dogs Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You need to add a dog before you can track potty breaks. Let's get started!
            </p>
            <button
              onClick={() => router.push('/add-dog')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Add Your First Dog
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Dog Selector */}
              {dogs.length > 1 && (
                <select
                  value={selectedDog?._id || ''}
                  onChange={(e) => {
                    const dog = dogs.find(d => d._id === e.target.value);
                    setSelectedDog(dog || null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 min-w-48"
                >
                  {dogs.map(dog => (
                    <option key={dog._id} value={dog._id}>
                      🐕 {dog.name}
                    </option>
                  ))}
                </select>
              )}
              
              {/* Log Potty Button */}
              <button
                onClick={() => setShowLogForm(true)}
                disabled={!selectedDog}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-lg">➕</span>
                Log Potty Break
              </button>
            </div>
          </div>

          {selectedDog && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedDog.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{selectedDog.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedDog.breed}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">❌</span>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Potty Log Form Modal */}
        {showLogForm && selectedDog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <PottyLogForm
                dogId={selectedDog._id}
                onSubmit={handleLogPotty}
                onCancel={() => setShowLogForm(false)}
                isLoading={isSaving}
              />
            </div>
          </div>
        )}

        {/* Potty History */}
        {selectedDog && (
          <PottyHistoryList
            records={pottyRecords}
            isLoading={isLoadingPotty}
            onRefresh={loadPottyRecords}
          />
        )}

        {/* Getting Started Guide (if no records) */}
        {selectedDog && pottyRecords.length === 0 && !isLoadingPotty && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Start Tracking {selectedDog.name}'s Potty Breaks
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Keep a detailed log of bathroom habits to monitor health, establish routines, and identify any potential issues early.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Quick Logging</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Record type, location, and any health observations in seconds
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Health Monitoring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track patterns and flag potential health concerns automatically
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Smart Insights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get timing recommendations and routine insights over time
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowLogForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200 inline-flex items-center gap-2"
              >
                <span className="text-lg">🚀</span>
                Log First Potty Break
              </button>
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Demo Mode
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                This is a demonstration of the potty tracking system. Records are simulated and won't be saved to the backend yet. 
                The full integration with the GraphQL backend is ready and will be connected in the next development phase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
