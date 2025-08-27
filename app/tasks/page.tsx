export default function TasksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
            <span className="text-5xl">📝</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Task Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Organize, track, and manage all your dog care tasks in one comprehensive dashboard
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Advanced Planning System
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Complete Care Organization
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                We're building a comprehensive task management system that helps you stay on top of 
                every aspect of your dog's care, from daily routines to long-term health planning.
              </p>

              {/* Task Categories Preview */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
                  <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Daily Care</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Feeding, walks, medication schedules</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Health Tasks</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Vet appointments, checkups, treatments</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Training</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Behavior goals, exercise routines</p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200/50 dark:border-orange-800/50">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-7 h-7 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Supplies</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Food orders, toy replacements</p>
                </div>
              </div>

              {/* Task Management Features */}
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                <div className="text-left">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m4 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-4 11H9m4 0a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smart Organization</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Auto-categorize tasks by priority, frequency, and type. Set up recurring tasks and dependencies.
                  </p>
                </div>

                <div className="text-left">
                  <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mobile Sync</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Access your task list anywhere. Complete tasks on-the-go and sync across all your devices.
                  </p>
                </div>

                <div className="text-left">
                  <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Progress Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Visualize completion rates, track habits, and celebrate achievements with detailed analytics.
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-400 to-purple-600 h-full rounded-full animate-pulse" style={{ width: '30%' }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Development Progress: 30% Complete</p>

              {/* Task Preview Mockup */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-8 border border-indigo-200/50 dark:border-indigo-800/50">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Preview: What Your Task Dashboard Will Look Like</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/60 dark:bg-gray-700/60 rounded-xl p-4 backdrop-blur-sm">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">📅 Today's Tasks</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Morning walk with Max (Completed)
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Give Luna her medication (Due 3:00 PM)
                      </div>
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Training session: Sit command (Scheduled)
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-700/60 rounded-xl p-4 backdrop-blur-sm">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm">📊 This Week's Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Daily walks</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">6/7 days</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Feeding schedule</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">100%</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>Training sessions</span>
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">3/4 planned</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-4">
                <button disabled className="px-8 py-4 bg-gradient-to-r from-indigo-400 to-purple-600 text-white font-semibold rounded-2xl shadow-lg opacity-50 cursor-not-allowed transform hover:scale-105 transition-all duration-200">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  Start Organizing Tasks
                </button>
                <p className="text-xs text-gray-400 dark:text-gray-500">This comprehensive system is being carefully crafted for you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Keep managing your dogs while we build this powerful system</p>
          <div className="flex justify-center space-x-4">
            <a href="/dogs" className="px-6 py-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-all duration-200 font-medium">
              View Your Dogs
            </a>
            <a href="/add-dog" className="px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-800/50 transition-all duration-200 font-medium">
              Add New Dog
            </a>
            <a href="/" className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium">
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
