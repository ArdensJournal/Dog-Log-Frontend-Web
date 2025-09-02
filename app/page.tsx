'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiClient } from '@/app/lib/api-client';
import { onAuthStateChanged, clearAuth } from '@/app/lib/auth';

export default function Page() {
  const [userName, setUserName] = useState('visitor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const result = await apiClient.getCurrentUser();
        setIsAuthenticated(result.isAuthenticated);
        
        if (result.isAuthenticated && result.user) {
          setUserName(result.user.name || result.user.email?.split('@')[0] || 'user');
        } else {
          setUserName('visitor');
        }
      } catch (error) {
        // Silently handle expected authentication failures
        setIsAuthenticated(false);
        setUserName('visitor');
      }
    };

    // Initial check
    verifyUser();
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(() => {
      console.log('🔄 Auth state change detected on homepage, refreshing user info...');
      verifyUser();
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  async function handleLogout() {
    try {
      await clearAuth(); // This will notify components and clear cache
      setUserName('visitor');
      setIsAuthenticated(false);
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if API call fails
      setUserName('visitor');
      setIsAuthenticated(false);
      window.location.reload();
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-800/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 dark:bg-purple-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/10 dark:bg-indigo-800/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            {/* Logo with enhanced styling */}
            <div className="relative inline-block mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 scale-110"></div>
              <img 
                src="/doglog-logo.png"
                alt="Dog Log Logo"
                className="relative mx-auto h-36 w-36 rounded-full shadow-2xl border-4 border-white dark:border-gray-700 ring-4 ring-blue-100 dark:ring-blue-900/50 transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Title with gradient text */}
            <h1 className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-400 dark:via-purple-500 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-sm mb-4">
              Dog Log
            </h1>
            
            {/* Subtitle with better typography */}
            <div className="space-y-3 mb-8">
              <p className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
                Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-bold">{userName}</span>! 🐕
              </p>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Your comprehensive dog care companion for tracking health, monitoring activities, and keeping your furry friend happy & healthy
              </p>
            </div>

            {/* Sign up/in buttons for non-authenticated users */}
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
                <Link 
                  href="/signup" 
                  className="group relative overflow-hidden px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  href="/signin" 
                  className="px-10 py-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 font-bold text-lg shadow-lg border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            )}
          </header>
        </div>
      </div>

      {/* Only show these sections if signed in */}
      {isAuthenticated && (
        <div className="relative max-w-6xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
          {/* Quick Actions - Enhanced */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Quick Actions</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your dogs and get started</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
              <Link 
                href="/dogs" 
                className="group relative overflow-hidden px-8 py-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-3xl">🐕</span>
                  <div className="text-left">
                    <div className="font-bold text-xl">View All Dogs</div>
                    <div className="text-indigo-100 text-sm">Manage your pets</div>
                  </div>
                </div>
              </Link>
              <Link 
                href="/add-dog" 
                className="group relative overflow-hidden px-8 py-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-3xl">➕</span>
                  <div className="text-left">
                    <div className="font-bold text-xl">Add New Dog</div>
                    <div className="text-green-100 text-sm">Register a pet</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Featured Health Tracking - Enhanced */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Health & Activity Tracking</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Monitor your dog's wellbeing with comprehensive tracking tools</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Link 
                href="/recent-activity" 
                className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <span className="text-4xl text-white">📊</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                    Monitor your dog's daily activities, health records, and important updates all in one comprehensive dashboard
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold text-lg group-hover:translate-x-3 transition-transform duration-300">
                    View Activity Dashboard
                    <svg className="w-6 h-6 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>

              <Link 
                href="/weight" 
                className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl hover:shadow-3xl transform hover:-translate-y-3 transition-all duration-500 border border-purple-200/50 dark:border-purple-700/50"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full -translate-y-20 translate-x-20 group-hover:scale-110 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <span className="text-4xl text-white">⚖️</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Weight Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                    Track weight trends, log measurements, and maintain your dog's optimal health with detailed analytics and insights
                  </p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold text-lg group-hover:translate-x-3 transition-transform duration-300">
                    Track Weight Progress
                    <svg className="w-6 h-6 ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Daily Care Activities - Enhanced Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Daily Care Activities</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Essential tools for your dog's daily health and wellness routine</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Link href="/needs" className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-amber-200/50 dark:border-amber-700/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <span className="text-3xl text-white">💩</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Report Needs</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Track your dog's potty breaks and bathroom schedules for better health monitoring</p>
                </div>
              </Link>

              <Link href="/vaccinations" className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-green-200/50 dark:border-green-700/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <span className="text-3xl text-white">💉</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Report Vaccination</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Log vaccinations, medications, and health records for comprehensive care tracking</p>
                </div>
              </Link>

              <Link href="/notifications" className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-yellow-200/50 dark:border-yellow-700/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-amber-200 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <span className="text-3xl text-white">🔔</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">View Notifications</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">See reminders, alerts, and important updates to stay on top of your dog's care</p>
                </div>
              </Link>

              <Link href="/tasks" className="group relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-pink-200/50 dark:border-pink-700/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-900/20 dark:to-rose-900/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <span className="text-3xl text-white">📝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Task List</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Manage your dog's daily tasks and activities with organized scheduling tools</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Features Overview - Only visible for non-authenticated users */}
      {!isAuthenticated && (
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/3 dark:to-purple-500/3 rounded-3xl"></div>
        
        <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-4xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-12 sm:p-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <span className="text-3xl text-white">🐕</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything Your Dog Needs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive health tracking, activity monitoring, and care management designed for modern pet parents who want the best for their furry family members
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-3xl text-white">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Health Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Advanced tracking of vaccinations, medications, and health records with detailed insights and trend analysis</p>
            </div>
            
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-3xl text-white">⏰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Reminders</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Intelligent notifications for walks, feeding times, medications, and vet appointments so you never miss a beat</p>
            </div>
            
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-3xl text-white">�</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Medical Records</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Professional reports ready for veterinary visits, with easy sharing capabilities for care teams and family</p>
            </div>
            
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-3xl text-white">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Family Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Share access with family members, trainers, walkers, and pet sitters for seamless care coordination</p>
            </div>
            
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-3xl text-white">🧬</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Breed Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Personalized care recommendations, health insights, and activity suggestions based on your dog's breed and age</p>
            </div>
            
            <div className="group text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-3xl text-white">☁️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cloud Sync</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Access your data anywhere with secure cloud synchronization across all your devices and platforms</p>
            </div>
          </div>
          
          {!isAuthenticated && (
            <div className="text-center mt-16 pt-12 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 font-semibold">
                Ready to give your dog the best care possible?
              </p>
              <Link 
                href="/signup" 
                className="group inline-flex items-center px-10 py-5 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <span className="relative z-10">Start Your Free Journey</span>
                <svg className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          )}
        </div>
      </div>
      )}
    </main>
  );
}