'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/app/lib/auth';
import { Dog } from '@/app/lib/api-client';
import { PottyRecord } from '@/app/lib/types/potty';
import { apiClient } from '@/app/lib/api-client';
import PottyLogForm from '@/app/components/potty/PottyLogForm';
import PottyHistoryList from '@/app/components/potty/PottyHistoryList';
import { 
  MdPets, 
  MdAdd, 
  MdAssignment, 
  MdBarChart, 
  MdSchedule
} from 'react-icons/md';

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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLogForm) {
        setShowLogForm(false);
      }
    };

    if (showLogForm) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showLogForm]);

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
      
      // Debug logging
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
    // Don't try to load dogs if not authenticated
    if (!user) {
      console.log('No authenticated user, skipping dog loading');
      return;
    }

    try {
      setIsLoadingDogs(true);
      setError(null);
      console.log('Loading dogs for user:', user);
      
      // Use the same method as the working /dogs page
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

  const loadPottyRecords = async () => {
    if (!selectedDog) return;

    try {
      setIsLoadingPotty(true);
      setError(null);
      
      // Load actual potty records from backend
      const response = await fetch(`/api/potty?dogId=${selectedDog._id}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load records: ${response.status}`);
      }
      
      const data = await response.json();
    console.log('Potty records from backend:', data.records);
    setPottyRecords(data.records || []);
      
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
      // Save to backend using the API route we created
      const response = await fetch('/api/potty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(pottyData),
      });
      if (!response.ok) {
        throw new Error(`Failed to save record: ${response.status}`);
      }
      const data = await response.json();
      // Reload records from backend so new log appears instantly
      await loadPottyRecords();
      setShowLogForm(false);
      console.log(`✅ ${pottyData.type === 'PEE' ? 'Pee' : 'Poop'} break logged successfully!`);
    } catch (error) {
      console.error('Error logging potty:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Failed to log potty break: ${errorMessage}`);
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
            <div className="text-8xl mb-6 flex justify-center">
              <MdPets className="text-8xl text-blue-500" />
            </div>
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
              
              {/* Action Button - More prominent placement */}
              {selectedDog && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowLogForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-3 text-lg"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <MdAdd className="text-xl" />
                    </div>
                    Log Potty Break
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">❌</span>
              <div className="flex-1">
                <p className="text-red-700 dark:text-red-300">{error}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setError(null);
                      checkAuth();
                    }}
                    className="text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => {
                      setError(null);
                      router.push('/signin');
                    }}
                    className="text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                  >
                    Sign In Again
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
            onClick={() => setShowLogForm(false)} // Click outside to close
          >
            <div 
              className="max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              {/* X Close Button */}
              <button
                onClick={() => setShowLogForm(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 shadow-lg"
                title="Close form (Esc)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
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
              <div className="text-6xl mb-4 flex justify-center">
                <MdPets className="text-6xl text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Start Tracking {selectedDog.name}'s Potty Breaks
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Keep a detailed log of bathroom habits to monitor health, establish routines, and identify any potential issues early.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MdAssignment className="text-2xl text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Quick Logging</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Record type, location, and any health observations in seconds
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MdBarChart className="text-2xl text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Health Monitoring</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Track patterns and flag potential health concerns automatically
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MdSchedule className="text-2xl text-purple-600 dark:text-purple-400" />
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

        {/* System Status */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Fully Functional
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Your potty tracking records are now being saved to the backend database and will persist across sessions. 
                All features including health flags, location tracking, and historical data are fully operational.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
