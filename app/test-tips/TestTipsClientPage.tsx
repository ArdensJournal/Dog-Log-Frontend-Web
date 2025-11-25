'use client';

import { useState, useEffect } from 'react';
import { MdPets, MdAutoAwesome, MdRefresh, MdCheckCircle, MdError, MdHourglassEmpty } from 'react-icons/md';

interface Dog {
  _id: string;
  name: string;
  breeds?: string[];
  imageUrl?: string;
}

interface Tip {
  _id: string;
  content: string;
  language?: string;
  source?: string;
  isRead?: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface TestTipsClientPageProps {
  dogs: Dog[];
}

export default function TestTipsClientPage({ dogs }: TestTipsClientPageProps) {
  const [selectedDog, setSelectedDog] = useState<string>('');
  const [tips, setTips] = useState<Tip[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [generateStatus, setGenerateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fetchStatus, setFetchStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [generateMessage, setGenerateMessage] = useState('');
  const [fetchMessage, setFetchMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRetryEnabled, setAutoRetryEnabled] = useState(false);

  // Countdown timer (no auto-fetch)
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGenerateTips = async () => {
    if (!selectedDog) {
      setGenerateMessage('Please select a dog first');
      setGenerateStatus('error');
      return;
    }

    setIsGenerating(true);
    setGenerateStatus('idle');
    setGenerateMessage('');
    setTips([]);
    setFetchStatus('idle');
    setFetchMessage('');

    try {
      console.log('🤖 Generating tips for dog:', selectedDog);
      console.log('🤖 Selected dog ID type:', typeof selectedDog);
      console.log('🤖 Selected dog ID length:', selectedDog.length);
      console.log('🤖 Request body:', JSON.stringify({ dogId: selectedDog, language: 'ENGLISH' }, null, 2));
      console.log('🤖 Postman working format:', JSON.stringify({
        createTipDto: { dogId: "6925f7750d11be7566b5f32a", language: "HEBREW" }
      }, null, 2));
      
      const response = await fetch('/api/tips/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dogId: selectedDog }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Full error response:', data);
        throw new Error(data.error || 'Failed to generate tips');
      }

      console.log('✅ Tips generation response:', data);
      console.log('✅ Full response details:', JSON.stringify(data, null, 2));
      console.log('✅ createGeminiTip result:', data.data?.createGeminiTip);
      setGenerateStatus('success');
      
      // Show which variant worked if available
      let successMsg = data.message || 'Tips generation started! Waiting for AI to process...';
      if (data.usedVariant) {
        successMsg += `\n\n✅ Used schema variant: ${data.usedVariant}`;
      }
      
      setGenerateMessage(successMsg);
      
      // Reset retry counter but don't enable auto-retry
      setRetryCount(0);
      setAutoRetryEnabled(false);
      
      // Show countdown as reference (no auto-fetch)
      setCountdown(20);
    } catch (error: any) {
      console.error('❌ Error generating tips:', error);
      setGenerateStatus('error');
      
      // Show more detailed error message
      let errorMsg = error.message || 'Failed to generate tips';
      if (error.graphQLErrors) {
        errorMsg += '\n\nGraphQL Errors: ' + JSON.stringify(error.graphQLErrors, null, 2);
      }
      
      setGenerateMessage(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFetchTips = async () => {
    if (!selectedDog) {
      setFetchMessage('Please select a dog first');
      setFetchStatus('error');
      return;
    }

    setIsFetching(true);
    setFetchStatus('idle');
    setFetchMessage('');

    try {
      console.log('📚 Fetching tips for dog:', selectedDog);
      console.log('📚 Fetch URL:', `/api/tips/${selectedDog}`);
      console.log('📚 Postman working query format:');
      console.log(JSON.stringify({
        findByDogIdDto: { dogId: "6925f7750d11be7566b5f32a" }
      }, null, 2));
      
      const response = await fetch(`/api/tips/${selectedDog}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch tips');
      }

      console.log('✅ Fetched tips:', data);
      console.log('✅ Full fetch response:', JSON.stringify(data, null, 2));
      console.log('✅ data.data:', data.data);
      console.log('✅ data.data.findTipsByDogId:', data.data?.findTipsByDogId);
      console.log('✅ tipsCount from server:', data.tipsCount);
      
      // Handle different response structures
      const tipsData = data.data?.findTipsByDogId || data.data || [];
      console.log('✅ Parsed tipsData:', tipsData);
      console.log('✅ Tips array length:', tipsData.length);
      
      setTips(tipsData);
      setFetchStatus('success');
      
      // If we got tips, stop auto-retry
      if (tipsData.length > 0) {
        setAutoRetryEnabled(false);
        setFetchMessage(`🎉 Successfully fetched ${tipsData.length} tip${tipsData.length !== 1 ? 's' : ''}!`);
      } else {
        const currentRetry = retryCount + 1;
        setRetryCount(currentRetry);
        
        // After 6 attempts (60 seconds), assume failure
        if (currentRetry >= 6) {
          setAutoRetryEnabled(false);
          setFetchStatus('error');
          setFetchMessage(
            `⚠️ No tips found after ${currentRetry} attempts (60+ seconds). ` +
            `The AI generation may have failed silently. Possible reasons:\n` +
            `• Gemini API error or timeout\n` +
            `• Insufficient dog data (need weight, activities, etc.)\n` +
            `• Backend processing error\n\n` +
            `Try: Add more data to your dog's profile and generate tips again.`
          );
        } else {
          setFetchMessage(`No tips yet (attempt ${currentRetry}). ${data.tipsCount !== undefined ? `Server reported: ${data.tipsCount} tips. ` : ''}AI may still be processing...`);
          
          // Auto-retry every 10 seconds if enabled
          if (autoRetryEnabled) {
            setTimeout(() => {
              console.log(`🔄 Auto-retrying fetch (attempt ${currentRetry + 1}/6)...`);
              handleFetchTips();
            }, 10000);
          }
        }
      }
    } catch (error: any) {
      console.error('❌ Error fetching tips:', error);
      setFetchStatus('error');
      setFetchMessage(error.message || 'Failed to fetch tips');
      setTips([]);
    } finally {
      setIsFetching(false);
    }
  };

  const selectedDogData = dogs.find(d => d._id === selectedDog);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-purple-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-8">
      <div className="w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h1 className="text-4xl font-bold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-3">
            <MdAutoAwesome className="text-5xl" />
            AI Tips Testing Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the AI tips generation and retrieval functions for your dogs
          </p>
        </div>

        {/* Dog Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
            <MdPets />
            Step 1: Select a Dog
          </h2>
          
          {dogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No dogs found. Please add a dog first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dogs.map((dog) => (
                <button
                  key={dog._id}
                  onClick={() => {
                    setSelectedDog(dog._id);
                    setGenerateStatus('idle');
                    setFetchStatus('idle');
                    setTips([]);
                    setGenerateMessage('');
                    setFetchMessage('');
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
          )}
        </div>

        {/* Generate Tips Section */}
        {selectedDog && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
              <MdAutoAwesome />
              Step 2: Generate AI Tips
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Click the button below to generate AI-powered tips for <strong>{selectedDogData?.name}</strong> using Gemini AI.
            </p>

            <button
              onClick={handleGenerateTips}
              disabled={isGenerating || !selectedDog}
              className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Generating Tips...
                </>
              ) : (
                <>
                  <MdAutoAwesome className="text-2xl" />
                  Generate AI Tips
                </>
              )}
            </button>

            {/* Generate Status */}
            {generateMessage && (
              <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                generateStatus === 'success' 
                  ? 'bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400'
                  : generateStatus === 'error'
                  ? 'bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-400'
              }`}>
                {generateStatus === 'success' ? <MdCheckCircle className="text-2xl mt-0.5 flex-shrink-0" /> : 
                 generateStatus === 'error' ? <MdError className="text-2xl mt-0.5 flex-shrink-0" /> : 
                 <MdHourglassEmpty className="text-2xl mt-0.5 flex-shrink-0" />}
                <div className="flex-1">
                  <p>{generateMessage}</p>
                  {countdown > 0 && (
                    <p className="mt-2 font-semibold">Auto-fetching tips in {countdown} seconds...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fetch Tips Section */}
        {selectedDog && generateStatus === 'success' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4 flex items-center gap-2">
              <MdRefresh />
              Step 3: Fetch Generated Tips
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Retrieve the AI-generated tips for <strong>{selectedDogData?.name}</strong>.
              {countdown > 0 && ` (Suggested wait time: ${countdown}s)`}
            </p>
            
            {tips.length === 0 && fetchStatus === 'success' && retryCount < 6 && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
                <p className="text-blue-800 dark:text-blue-300 font-semibold mb-2">
                  💡 <strong>No tips found yet (Attempt {retryCount}/6)</strong>
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                  The AI is still processing. Gemini AI can take 30-90 seconds to generate personalized tips based on your dog's data.
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <label className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRetryEnabled}
                      onChange={(e) => setAutoRetryEnabled(e.target.checked)}
                      className="rounded border-blue-400"
                    />
                    <span>Auto-retry every 10 seconds (up to 6 times / 60 seconds)</span>
                  </label>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-xs">
                  {autoRetryEnabled 
                    ? `✓ Auto-retry enabled. Next check in 10 seconds... (${6 - retryCount} attempts remaining)` 
                    : 'Enable auto-retry above, or click "Fetch Tips Now" manually'}
                </p>
              </div>
            )}
            
            {tips.length === 0 && fetchStatus === 'error' && retryCount >= 6 && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-700 rounded-lg">
                <p className="text-red-800 dark:text-red-300 font-bold mb-2">
                  ⚠️ AI Generation Likely Failed
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                  No tips appeared after 6 attempts (60+ seconds). The backend accepted the request but no tips were generated.
                </p>
                <div className="bg-red-100 dark:bg-red-900/50 rounded p-3 mb-3 text-xs">
                  <p className="font-semibold mb-2 text-red-900 dark:text-red-200">Possible Causes:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-800 dark:text-red-300">
                    <li>Gemini API error or timeout</li>
                    <li>Insufficient dog data (add weight records, activities, potty logs)</li>
                    <li>Backend processing error (check backend logs)</li>
                    <li>AI service temporarily unavailable</li>
                  </ul>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setRetryCount(0);
                      setFetchStatus('idle');
                      setAutoRetryEnabled(false);
                    }}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                  >
                    Reset & Try Different Dog
                  </button>
                  <button
                    onClick={() => {
                      setRetryCount(0);
                      setFetchStatus('idle');
                      setAutoRetryEnabled(true);
                      handleFetchTips();
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                  >
                    Force Retry Anyway
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleFetchTips}
              disabled={isFetching || !selectedDog}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition flex items-center justify-center gap-3 text-lg"
            >
              {isFetching ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Fetching Tips...
                </>
              ) : (
                <>
                  <MdRefresh className="text-2xl" />
                  Fetch Tips Now
                </>
              )}
            </button>

            {/* Fetch Status */}
            {fetchMessage && (
              <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                fetchStatus === 'success' 
                  ? 'bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400'
                  : fetchStatus === 'error'
                  ? 'bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 border border-blue-400 dark:border-blue-700 text-blue-700 dark:text-blue-400'
              }`}>
                {fetchStatus === 'success' ? <MdCheckCircle className="text-2xl mt-0.5 flex-shrink-0" /> : 
                 fetchStatus === 'error' ? <MdError className="text-2xl mt-0.5 flex-shrink-0" /> : 
                 <MdHourglassEmpty className="text-2xl mt-0.5 flex-shrink-0" />}
                <p>{fetchMessage}</p>
              </div>
            )}
          </div>
        )}

        {/* Tips Display */}
        {tips.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4">
              AI-Generated Tips ({tips.length})
            </h2>
            
            <div className="space-y-4">
              {tips.map((tip, index) => (
                <div
                  key={tip._id}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-5 border-l-4 border-purple-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
                        {tip.content}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        {tip.language && (
                          <span className="px-2 py-1 bg-purple-200 dark:bg-purple-800 rounded-full">
                            🌐 {tip.language}
                          </span>
                        )}
                        {tip.source && (
                          <span className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded-full">
                            🤖 {tip.source}
                          </span>
                        )}
                        {tip.isRead !== undefined && (
                          <span className={`px-2 py-1 rounded-full ${tip.isRead ? 'bg-green-200 dark:bg-green-800' : 'bg-yellow-200 dark:bg-yellow-800'}`}>
                            {tip.isRead ? '✓ Read' : '• New'}
                          </span>
                        )}
                        <span className="text-xs">
                          {new Date(tip.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-400 mb-2">
            📝 Testing Instructions:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800 dark:text-yellow-300">
            <li>Select a dog from the list above</li>
            <li>Click "Generate AI Tips" to trigger AI tip generation (via Gemini)</li>
            <li><strong>Wait 20-30 seconds, then click "Fetch Tips Now" manually</strong></li>
            <li>Enable "Auto-retry" checkbox if you want automatic retry every 10 seconds</li>
            <li>View the generated tips below</li>
            <li>Check the browser console for detailed API logs</li>
          </ol>
          <p className="mt-4 text-sm text-yellow-700 dark:text-yellow-400">
            <strong>Note:</strong> In production, tip generation will be automatic and won't require UI interaction.
          </p>
        </div>
      </div>
    </main>
  );
}
