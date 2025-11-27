'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MdPets, MdAutoAwesome, MdArrowBack } from 'react-icons/md';

interface Dog {
  _id: string;
  name: string;
  breeds?: string[];
  imageUrl?: string;
  birthday?: string;
  gender?: 'MALE' | 'FEMALE';
}

interface HealthCheck {
  _id: string;
  content: string;
  language?: string;
  source?: string;
  isRead?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface HealthInsightsClientPageProps {
  dogs: Dog[];
}

export default function HealthInsightsClientPage({ dogs }: HealthInsightsClientPageProps) {
  const [selectedDog, setSelectedDog] = useState<string>('');
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleCheckMyDog = async () => {
    if (!selectedDog) {
      setError('Please select a dog first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Generate new health insights
      const generateResponse = await fetch('/api/tips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dogId: selectedDog }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate health insights');
      }

      // Wait a bit for AI to process
      await new Promise(resolve => setTimeout(resolve, 25000));

      // Fetch the health insights
      const fetchResponse = await fetch(`/api/tips/${selectedDog}`);
      const data = await fetchResponse.json();

      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch health insights');
      }

      const insights = data.data?.findTipsByDogId || data.data || [];
      setHealthChecks(insights);
      
      if (insights.length === 0) {
        setError('No health insights available yet. The AI may still be processing. Please try again in a moment.');
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to get health insights');
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedDogData = dogs.find(d => d._id === selectedDog);

  // Sort health checks by date (most recent first)
  const sortedHealthChecks = [...healthChecks].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-100 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-8">
      <div className="w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 mb-4">
            <MdArrowBack className="text-xl" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-3">
            <MdAutoAwesome className="text-5xl" />
            Dog Health Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get AI-powered health insights and recommendations for your dog
          </p>
        </div>

        {/* Dog Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
            <MdPets />
            Select Your Dog
          </h2>
          
          {dogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="mb-4">No dogs found. Please add a dog first.</p>
              <Link 
                href="/add-dog"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition"
              >
                Add Your First Dog
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {dogs.map((dog) => (
                  <button
                    key={dog._id}
                    onClick={() => {
                      setSelectedDog(dog._id);
                      setError('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedDog === dog._id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {dog.imageUrl ? (
                        <img
                          src={dog.imageUrl}
                          alt={dog.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center">
                          <MdPets className="text-2xl text-purple-600 dark:text-purple-300" />
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white">{dog.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {dog.breeds?.join(', ') || 'Unknown breed'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedDog && (
                <button
                  onClick={handleCheckMyDog}
                  disabled={isGenerating}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-3 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Analyzing {selectedDogData?.name}'s Health...
                    </>
                  ) : (
                    <>
                      <MdAutoAwesome className="text-2xl" />
                      Check My Dog
                    </>
                  )}
                </button>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        {/* Health Insights Display */}
        {sortedHealthChecks.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-6">
              Health Insights for {selectedDogData?.name}
            </h2>
            
            <div className="space-y-6">
              {sortedHealthChecks.map((check, index) => (
                <div
                  key={check._id}
                  className={`rounded-lg p-6 border-l-4 ${
                    index === 0 
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-purple-600 shadow-lg'
                      : 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-400'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-purple-600' : 'bg-purple-500'
                    }`}>
                      <MdAutoAwesome className="text-xl" />
                    </div>
                    <div className="flex-1">
                      {index === 0 && (
                        <div className="mb-2">
                          <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                            MOST RECENT
                          </span>
                        </div>
                      )}
                      <p className="text-gray-900 dark:text-white text-lg leading-relaxed mb-3">
                        {check.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        {check.language && (
                          <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 rounded-full">
                            🌐 {check.language}
                          </span>
                        )}
                        {check.source && (
                          <span className="px-2 py-1 bg-pink-200 dark:bg-pink-800 rounded-full">
                            🤖 {check.source}
                          </span>
                        )}
                        <span className="text-xs">
                          {new Date(check.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-800 dark:text-blue-400 mb-2">
            💡 How It Works
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800 dark:text-blue-300">
            <li>Select your dog from the list above</li>
            <li>Click "Check My Dog" to generate AI-powered health insights</li>
            <li>The AI analyzes your dog's data including weight, activities, breed, age, and more</li>
            <li>Personalized health recommendations appear below (takes 20-30 seconds)</li>
            <li>Most recent insights are displayed first</li>
            <li>Previous checks are stored and shown chronologically</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
