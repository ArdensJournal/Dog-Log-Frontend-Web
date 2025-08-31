export default function WearablePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
            <span className="text-5xl">⌚</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Wearable Device
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Connect and sync your dog's wearable device for real-time health and activity tracking.
          </p>
        </div>
        {/* Coming Soon Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" /><rect x="7" y="7" width="6" height="6" rx="2" fill="white" /></svg>
                Wearable System in Progress
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Device Integration & Insights
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Soon you'll be able to connect your dog's wearable device, monitor activity, track health metrics, and receive smart alerts.
              </p>
              {/* Preview Features */}
              <div className="grid md:grid-cols-2 gap-6 mb-10">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Device Sync</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Connect popular pet wearables for seamless data import</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Activity Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Monitor steps, playtime, and rest patterns</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200/50 dark:border-yellow-800/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Health Metrics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Track heart rate, temperature, and more</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-pink-200/50 dark:border-pink-800/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Alerts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Get notified about unusual activity or health concerns</p>
                </div>
              </div>
              {/* Progress Indicator */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full animate-pulse" style={{ width: '10%' }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Development Progress: 10% Complete</p>
              {/* CTA Section */}
              <div className="space-y-4">
                <button disabled className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-2xl shadow-lg opacity-50 cursor-not-allowed transform hover:scale-105 transition-all duration-200">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h5l-5-5v5zm0 10v-5H4l5 5z" /></svg>
                  Wearable Integration Coming Soon
                </button>
                <p className="text-xs text-gray-400 dark:text-gray-500">Connect your device soon for smarter tracking!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
