export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-yellow-900 dark:to-orange-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-6">
            <span className="text-5xl animate-bounce">🔔</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Notifications
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Never miss important reminders, alerts, and updates for your dog's care and wellbeing
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7l-7-5zM10 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                </svg>
                Smart System in Progress
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Intelligent Care Reminders
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                We're developing an intelligent notification system that learns your dog's patterns and 
                sends personalized reminders at the perfect times to keep your pet healthy and happy.
              </p>

              {/* Notification Types Preview */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200/50 dark:border-yellow-800/50">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h5l-5-5v5zm0 10v-5H4l5 5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Feeding Reminders</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Customizable meal time notifications based on your dog's schedule and dietary needs</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Health Alerts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Vaccination due dates, medication schedules, and veterinary appointment reminders</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-800/50">
                  <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Activity Nudges</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Walk reminders, exercise goals, and playtime suggestions based on breed and age</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Behavior Insights</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Pattern alerts for unusual behavior or changes in routine that may need attention</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200/50 dark:border-red-800/50">
                  <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Emergency Alerts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Critical notifications for urgent health issues or emergency care situations</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-indigo-200/50 dark:border-indigo-800/50">
                  <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Social Updates</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Community updates, nearby events, and social features for you and your dog</p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full animate-pulse" style={{ width: '45%' }}></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Development Progress: 45% Complete</p>

              {/* Smart Features Preview */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 mb-8 border border-yellow-200/50 dark:border-yellow-800/50">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🤖 AI-Powered Intelligence</h3>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">Smart Scheduling</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Learns your routine and suggests optimal timing for all activities</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">Contextual Alerts</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Weather-aware walk suggestions and seasonal care reminders</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">Multi-Channel</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Email, SMS, push notifications, and in-app alerts</p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="space-y-4">
                <button disabled className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-2xl shadow-lg opacity-50 cursor-not-allowed transform hover:scale-105 transition-all duration-200">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h5l-5-5v5zm0 10v-5H4l5 5z" />
                  </svg>
                  Enable Notifications Soon
                </button>
                <p className="text-xs text-gray-400 dark:text-gray-500">We'll keep you informed about development progress!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Keep tracking your dogs while we build this feature</p>
          <div className="flex justify-center space-x-4">
            <a href="/dogs" className="px-6 py-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-all duration-200 font-medium">
              Manage Your Dogs
            </a>
            <a href="/add-dog" className="px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-800/50 transition-all duration-200 font-medium">
              Add New Dog
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
