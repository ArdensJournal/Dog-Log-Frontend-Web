'use client';

import { useState, useMemo } from 'react';
import { WeightRecord, WeightUnit, WEIGHT_UNITS } from '@/app/lib/types/weight';
import { MdScale, MdPerson, MdCalendarToday, MdSort, MdFilterList } from 'react-icons/md';

interface WeightHistoryListProps {
  records: WeightRecord[];
  isLoading?: boolean;
  unit?: WeightUnit;
  onRefresh?: () => void;
}

interface FilterState {
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest';
  dateRange: 'all' | 'week' | 'month' | '3months';
}

export default function WeightHistoryList({ 
  records, 
  isLoading = false, 
  unit = 'kg',
  onRefresh 
}: WeightHistoryListProps) {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'newest',
    dateRange: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort records
  const filteredRecords = useMemo(() => {
    let filtered = [...records];

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(record => 
        new Date(record.date) >= cutoffDate
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.value - a.value;
        case 'lowest':
          return a.value - b.value;
        default:
          return 0;
      }
    });

    return filtered;
  }, [records, filters]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      }
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getWeightChange = (currentRecord: WeightRecord, index: number) => {
    if (index >= filteredRecords.length - 1) return null;
    
    // Find the previous record by date, not by array index
    const sortedByDate = [...records].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const currentIndex = sortedByDate.findIndex(r => r._id === currentRecord._id);
    if (currentIndex <= 0) return null;
    
    const previousRecord = sortedByDate[currentIndex - 1];
    const change = currentRecord.value - previousRecord.value;
    const changePercent = (change / previousRecord.value) * 100;
    
    return { change, changePercent };
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weight History ({filteredRecords.length})
          </h3>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <MdFilterList className="w-4 h-4" />
              Filters
            </button>
            
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort by
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sortBy: e.target.value as FilterState['sortBy'] 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Weight</option>
                  <option value="lowest">Lowest Weight</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    dateRange: e.target.value as FilterState['dateRange'] 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Time</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="3months">Past 3 Months</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Records List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredRecords.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MdScale className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No weight records found</p>
            <p className="text-sm mt-1">
              {filters.dateRange !== 'all' || records.length === 0 
                ? 'Try adjusting your filters or add some weight records'
                : 'Add your first weight record to get started'
              }
            </p>
          </div>
        ) : (
          filteredRecords.map((record, index) => {
            const weightInUnit = WEIGHT_UNITS[unit].fromKg(record.value);
            const change = getWeightChange(record, index);
            
            return (
              <div key={record._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Weight Icon */}
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdScale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {weightInUnit.toFixed(1)} {WEIGHT_UNITS[unit].symbol}
                        </span>
                        
                        {change && Math.abs(change.changePercent) > 0.5 && (
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            change.change > 0 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {change.change > 0 ? '+' : ''}{WEIGHT_UNITS[unit].fromKg(change.change).toFixed(1)} {WEIGHT_UNITS[unit].symbol}
                            ({change.changePercent > 0 ? '+' : ''}{change.changePercent.toFixed(1)}%)
                          </span>
                        )}
                      </div>
                      
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(record.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MdPerson className="w-4 h-4" />
                        <span>Logged by {record.addedBy.name || record.addedBy.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MdCalendarToday className="w-4 h-4" />
                        <span>
                          {new Date(record.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
