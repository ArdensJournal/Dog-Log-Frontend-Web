'use client';

import { useState, useMemo } from 'react';
import { PottyRecord, PottyType, PottyEnvironment, PottyHealthFlag } from '@/app/lib/types/potty';
import PottyCard from './PottyCard';

interface PottyHistoryListProps {
  records: PottyRecord[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

interface FilterState {
  search: string;
  type: 'all' | PottyType;
  environment: 'all' | PottyEnvironment;
  healthFlags: 'all' | 'with-flags' | 'without-flags';
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'newest' | 'oldest';
}

export default function PottyHistoryList({ records, isLoading = false, onRefresh }: PottyHistoryListProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    environment: 'all',
    healthFlags: 'all',
    dateRange: 'all',
    sortBy: 'newest'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    let filtered = [...records].filter(r => r && r.date);

    // Search filter (notes)
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(record => 
        record.note?.toLowerCase().includes(searchTerm)
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(record => record.type === filters.type);
    }

    // Environment filter
    if (filters.environment !== 'all') {
      filtered = filtered.filter(record => record.environment === filters.environment);
    }

    // Health flags filter
    if (filters.healthFlags === 'with-flags') {
      filtered = filtered.filter(record => record.healthFlags && record.healthFlags.length > 0);
    } else if (filters.healthFlags === 'without-flags') {
      filtered = filtered.filter(record => !record.healthFlags || record.healthFlags.length === 0);
    }

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (filters.dateRange === 'today') {
      filtered = filtered.filter(record => new Date(record.date) >= today);
    } else if (filters.dateRange === 'week') {
      filtered = filtered.filter(record => new Date(record.date) >= weekAgo);
    } else if (filters.dateRange === 'month') {
      filtered = filtered.filter(record => new Date(record.date) >= monthAgo);
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filters.sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [records, filters]);

  // Statistics
  const stats = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    // Only use valid records for stats
    const validRecords = records.filter(r => r && r.date && r.type && r.environment);
    const todayRecords = validRecords.filter(record => new Date(record.date) >= todayStart);
    const withHealthFlags = validRecords.filter(record => record.healthFlags && record.healthFlags.length > 0);
    return {
      total: validRecords.length,
      today: todayRecords.length,
      withHealthFlags: withHealthFlags.length,
      peeCount: validRecords.filter(r => r.type === PottyType.PEE).length,
      poopCount: validRecords.filter(r => r.type === PottyType.POOP).length,
      indoorCount: validRecords.filter(r => r.environment === PottyEnvironment.INDOORS).length,
      outdoorCount: validRecords.filter(r => r.environment === PottyEnvironment.OUTDOORS).length
    };
  }, [records]);

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      environment: 'all',
      healthFlags: 'all',
      dateRange: 'all',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.environment !== 'all' || 
                          filters.healthFlags !== 'all' || filters.dateRange !== 'all' || filters.sortBy !== 'newest';

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-3xl">📊</span>
            Potty History
          </h2>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <span className={`text-lg ${isLoading ? 'animate-spin' : ''}`}>🔄</span>
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Records</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.today}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Today</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700">
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.peeCount}</div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Pee Breaks</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.poopCount}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Poop Breaks</div>
          </div>
        </div>

        {stats.withHealthFlags > 0 && (
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium">
                {stats.withHealthFlags} record{stats.withHealthFlags > 1 ? 's' : ''} with health flags
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between text-left bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔍</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Filters & Search
            </span>
            {hasActiveFilters && (
              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                Active
              </span>
            )}
          </div>
          <span className={`text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            ⌄
          </span>
        </button>

        {isExpanded && (
          <div className="p-6 space-y-4 border-t border-gray-200 dark:border-gray-600">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Notes
              </label>
              <input
                type="text"
                id="search"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search in notes..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as FilterState['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Types</option>
                  <option value={PottyType.PEE}>💛 Pee</option>
                  <option value={PottyType.POOP}>💩 Poop</option>
                </select>
              </div>

              {/* Environment Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Environment
                </label>
                <select
                  value={filters.environment}
                  onChange={(e) => setFilters(prev => ({ ...prev, environment: e.target.value as FilterState['environment'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Environments</option>
                  <option value={PottyEnvironment.INDOORS}>🏠 Indoor</option>
                  <option value={PottyEnvironment.OUTDOORS}>🌳 Outdoor</option>
                </select>
              </div>

              {/* Health Flags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Health Flags
                </label>
                <select
                  value={filters.healthFlags}
                  onChange={(e) => setFilters(prev => ({ ...prev, healthFlags: e.target.value as FilterState['healthFlags'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Records</option>
                  <option value="with-flags">⚠️ With Health Flags</option>
                  <option value="without-flags">✅ Normal</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as FilterState['dateRange'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Time</option>
                  <option value="today">📅 Today</option>
                  <option value="week">📅 Past Week</option>
                  <option value="month">📅 Past Month</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="newest">🕒 Newest First</option>
                  <option value="oldest">🕐 Oldest First</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredRecords.length} of {records.length} records
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading records...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {records.length === 0 ? 'No Records Yet' : 'No Matching Records'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {records.length === 0 
                ? 'Start by logging your first potty break!'
                : hasActiveFilters 
                  ? 'Try adjusting your filters to see more results.'
                  : 'No records found.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          filteredRecords.map((record) => (
            <PottyCard key={record._id} record={record} />
          ))
        )}
      </div>
    </div>
  );
}
