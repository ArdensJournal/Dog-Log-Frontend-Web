'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { checkAuthStatus } from '@/app/lib/auth';
import { apiClient, Dog } from '@/app/lib/api-client';
import { WeightRecord, CreateWeightDto, WeightUnit, WEIGHT_UNITS } from '@/app/lib/types/weight';
import WeightLogForm from '@/app/components/weight/WeightLogForm';
import WeightChart from '@/app/components/weight/WeightChart';
import WeightHistoryList from '@/app/components/weight/WeightHistoryList';
import { 
  MdScale, 
  MdPets, 
  MdAdd, 
  MdArrowBack, 
  MdTrendingUp,
  MdTrendingDown,
  MdTrendingFlat,
  MdSettings
} from 'react-icons/md';

function WeightPageContent() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [isLoadingDogs, setIsLoadingDogs] = useState(false);
  const [isLoadingWeights, setIsLoadingWeights] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<WeightUnit>('kg');

  const router = useRouter();
  const searchParams = useSearchParams();
  const dogIdParam = searchParams.get('dogId');

  // Load authentication
  useEffect(() => {
    checkAuth();
  }, []);

  // Load dogs when authenticated
  useEffect(() => {
    if (user && !authLoading) {
      loadDogs();
    }
  }, [user, authLoading]);

  // Load weight records when dog is selected
  useEffect(() => {
    if (selectedDog) {
      loadWeightRecords();
    }
  }, [selectedDog]);

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLogForm) {
        setShowLogForm(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showLogForm]);

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
      
      const result = await apiClient.getDogs();
      const fetchedDogs = result.data?.userDogs || [];
      setDogs(fetchedDogs);
      
      // Auto-select dog from URL or first available
      if (dogIdParam && fetchedDogs.length > 0) {
        const targetDog = fetchedDogs.find((dog: Dog) => dog._id === dogIdParam);
        if (targetDog) {
          setSelectedDog(targetDog);
        } else {
          setSelectedDog(fetchedDogs[0]);
        }
      } else if (fetchedDogs.length > 0 && !selectedDog) {
        setSelectedDog(fetchedDogs[0]);
      }
      
    } catch (error) {
      console.error('Error loading dogs:', error);
      setError('Failed to load your dogs. Please try again.');
    } finally {
      setIsLoadingDogs(false);
    }
  };

  const loadWeightRecords = async () => {
    if (!selectedDog) return;

    try {
      setIsLoadingWeights(true);
      setError(null);
      
      const response = await fetch(`/api/weight?dogId=${selectedDog._id}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load weight records: ${response.status}`);
      }
      
      const result = await response.json();
      setWeightRecords(result.data || []);
      
    } catch (error) {
      console.error('Error loading weight records:', error);
      setError('Failed to load weight records. Please try again.');
    } finally {
      setIsLoadingWeights(false);
    }
  };

  const handleLogWeight = async (weightData: CreateWeightDto) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch('/api/weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(weightData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save weight record: ${response.status}`);
      }

      const result = await response.json();
      
      // Add new record to the beginning of the list
      setWeightRecords(prev => [result.data, ...prev]);
      setShowLogForm(false);
      
      console.log('✅ Weight record saved successfully!');
      
    } catch (error) {
      console.error('Error logging weight:', error);
      setError('Failed to log weight. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate weight statistics
  const weightStats = (() => {
    if (weightRecords.length === 0) return null;
    
    const sortedRecords = [...weightRecords].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const latest = sortedRecords[sortedRecords.length - 1];
    const previous = sortedRecords.length > 1 ? sortedRecords[sortedRecords.length - 2] : null;
    
    let change = 0;
    let changePercent = 0;
    let trend: 'up' | 'down' | 'stable' = 'stable';
    
    if (previous) {
      change = latest.value - previous.value;
      changePercent = (change / previous.value) * 100;
      
      if (Math.abs(changePercent) > 1) {
        trend = change > 0 ? 'up' : 'down';
      }
    }
    
    return {
      current: WEIGHT_UNITS[unit].fromKg(latest.value),
      change: Math.abs(WEIGHT_UNITS[unit].fromKg(change)),
      changePercent: Math.abs(changePercent),
      trend,
      isIncrease: change > 0,
      totalRecords: weightRecords.length,
      firstRecord: sortedRecords[0],
      lastRecord: latest,
    };
  })();

  // Loading states
  if (authLoading || isLoadingDogs) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push('/signin');
    return null;
  }

  // No dogs case
  if (dogs.length === 0 && !isLoadingDogs) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
              <MdScale className="text-4xl text-purple-600" />
              Weight Tracking
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your dog's weight trends and health
            </p>
          </div>

          {/* No Dogs Message */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <MdPets className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No Dogs Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start tracking your dog's weight by adding your first furry friend to the system.
            </p>
            <Link
              href="/add-dog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MdPets className="w-5 h-5" />
              Add Your First Dog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                <MdScale className="text-4xl text-purple-600" />
                Weight Tracking
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your dog's weight trends and health
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
              
              {/* Unit Toggle */}
              <div className="flex items-center gap-2">
                <MdSettings className="w-4 h-4 text-gray-500" />
                <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  {(Object.keys(WEIGHT_UNITS) as WeightUnit[]).map((unitOption) => (
                    <button
                      key={unitOption}
                      onClick={() => setUnit(unitOption)}
                      className={`px-3 py-1 text-sm font-medium transition-colors ${
                        unit === unitOption
                          ? 'bg-purple-600 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {WEIGHT_UNITS[unitOption].symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Dog Info */}
        {selectedDog && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedDog.imageUrl ? (
                  <img
                    src={selectedDog.imageUrl}
                    alt={selectedDog.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <MdPets className="text-purple-600 dark:text-purple-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedDog.name}'s Weight
                  </h2>
                  {weightStats && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>{weightStats.totalRecords} record{weightStats.totalRecords !== 1 ? 's' : ''}</span>
                      {weightStats.totalRecords > 1 && (
                        <>
                          <span>•</span>
                          <span className={`flex items-center gap-1 ${
                            weightStats.trend === 'up' ? 'text-green-600' :
                            weightStats.trend === 'down' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {weightStats.trend === 'up' ? <MdTrendingUp className="w-4 h-4" /> :
                             weightStats.trend === 'down' ? <MdTrendingDown className="w-4 h-4" /> :
                             <MdTrendingFlat className="w-4 h-4" />}
                            {weightStats.trend === 'stable' ? 'Stable' : 
                             `${weightStats.isIncrease ? 'Up' : 'Down'} ${weightStats.changePercent.toFixed(1)}%`}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowLogForm(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <MdAdd />
                Log Weight
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {selectedDog && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-8">
              {/* Weight Chart */}
              <WeightChart 
                records={weightRecords} 
                unit={unit}
              />
              
              {/* Weight History */}
              <WeightHistoryList
                records={weightRecords}
                isLoading={isLoadingWeights}
                unit={unit}
                onRefresh={loadWeightRecords}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              {weightStats && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Current Weight
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-1">
                        {weightStats.current.toFixed(1)}
                      </div>
                      <div className="text-lg text-gray-600 dark:text-gray-400">
                        {WEIGHT_UNITS[unit].symbol}
                      </div>
                    </div>
                    
                    {weightStats.totalRecords > 1 && (
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className={`text-center text-sm ${
                          weightStats.trend === 'up' ? 'text-green-600' :
                          weightStats.trend === 'down' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {weightStats.trend === 'up' ? <MdTrendingUp /> :
                             weightStats.trend === 'down' ? <MdTrendingDown /> :
                             <MdTrendingFlat />}
                            Since last record
                          </div>
                          <div className="font-medium">
                            {weightStats.isIncrease ? '+' : '-'}{weightStats.change.toFixed(1)} {WEIGHT_UNITS[unit].symbol}
                            ({weightStats.changePercent.toFixed(1)}%)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Add Form */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Add
                </h3>
                <WeightLogForm
                  dogId={selectedDog._id}
                  dogName={selectedDog.name}
                  onSubmit={handleLogWeight}
                  isLoading={isSaving}
                  defaultUnit={unit}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Form */}
        {showLogForm && selectedDog && (
          <WeightLogForm
            dogId={selectedDog._id}
            dogName={selectedDog.name}
            onSubmit={handleLogWeight}
            onCancel={() => setShowLogForm(false)}
            isLoading={isSaving}
            isModal={true}
            defaultUnit={unit}
          />
        )}
      </div>
    </div>
  );
}

function WeightPageFallback() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
          <MdScale className="text-xl" />
          <span>Loading weight tracking...</span>
        </div>
      </div>
    </div>
  );
}

export default function WeightPage() {
  return (
    <Suspense fallback={<WeightPageFallback />}>
      <WeightPageContent />
    </Suspense>
  );
}
