export default function VaccinationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-red-900 dark:to-pink-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
            <span className="text-5xl">💉</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Vaccination Records
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Keep comprehensive records of your dog's vaccinations, medications, and veterinary care
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
                In Development
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Digital Health Records
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                We're creating a comprehensive digital health record system that will help you track 
                vaccinations, set reminders, and share information with your veterinarian seamlessly.
              </p>

              {/* Features Preview */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200/50 dark:border-red-800/50">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Vaccine Records</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Digital vaccination certificates</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h5l-5-5v5zm0 10v-5H4l5 5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Smart Reminders</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Automated booster alerts</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Vet Sharing</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Easy record sharing</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Health Analytics</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Track health trends</p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                <div className="bg-gradient-to-r from-red-400 to-pink-600 h-full rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Development Progress: 60% Complete</p>

              {/* Medical Information Preview */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 mb-8 border border-red-200/50 dark:border-red-800/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What You'll Be Able to Track</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center"><span className="text-red-500 mr-2">•</span> Core vaccines (DHPP, Rabies)</li>
                    <li className="flex items-center"><span className="text-red-500 mr-2">•</span> Optional vaccines (Bordatella, Lyme)</li>
                    <li className="flex items-center"><span className="text-red-500 mr-2">•</span> Medication schedules</li>
                  </ul>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center"><span className="text-pink-500 mr-2">•</span> Vet visit history</li>
                    <li className="flex items-center"><span className="text-pink-500 mr-2">•</span> Blood work results</li>
                    <li className="flex items-center"><span className="text-pink-500 mr-2">•</span> Treatment records</li>
                  </ul>
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-4">
                <button disabled className="px-8 py-4 bg-gradient-to-r from-red-400 to-pink-600 text-white font-semibold rounded-2xl shadow-lg opacity-50 cursor-not-allowed transform hover:scale-105 transition-all duration-200">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Feature Coming Soon
                </button>
                <p className="text-xs text-gray-400 dark:text-gray-500">Join our community to get early access!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Continue managing your dogs</p>
          <div className="flex justify-center space-x-4">
            <a href="/dogs" className="px-6 py-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-all duration-200 font-medium">
              View Your Dogs
            </a>
            <a href="/" className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
