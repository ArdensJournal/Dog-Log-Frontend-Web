'use client';

import { useState, useEffect, useMemo } from 'react';
import { PottyType, PottyEnvironment, PottyHealthFlag, HEALTH_FLAG_INFO } from '@/app/lib/types/potty';

interface PottyLogFormProps {
  dogId: string;
  onSubmit: (data: {
    dog: string;
    date: string;
    type: PottyType;
    environment?: PottyEnvironment;
    healthFlags?: PottyHealthFlag[];
    note?: string;
    coordinates?: { latitude: number; longitude: number };
  }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function PottyLogForm({ dogId, onSubmit, onCancel, isLoading = false }: PottyLogFormProps) {
  // Helper function to get current datetime in the correct format for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    // Adjust for local timezone offset
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);
    return localTime.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    type: PottyType.PEE,
    environment: PottyEnvironment.OUTDOORS,
    healthFlags: [] as PottyHealthFlag[],
    note: '',
    date: getCurrentDateTime(), // Always start with current date/time
    useCurrentLocation: false
  });

  // Only show relevant health flags for the selected potty type
  const relevantHealthFlags = useMemo(() => {
    if (formData.type === PottyType.PEE) {
      return [
        PottyHealthFlag.BLOODY_URINE,
        PottyHealthFlag.DARK_URINE,
        PottyHealthFlag.FREQUENT_URINATION,
        PottyHealthFlag.PAINFUL_URINATION,
        PottyHealthFlag.UNUSUAL_COLOR
      ];
    } else if (formData.type === PottyType.POOP) {
      return [
        PottyHealthFlag.BLACK_TARRY,
        PottyHealthFlag.BLOOD,
        PottyHealthFlag.CONSTIPATION,
        PottyHealthFlag.DIARRHEA,
        PottyHealthFlag.MUCUS,
        PottyHealthFlag.UNDIGESTED_FOOD,
        PottyHealthFlag.UNUSUAL_COLOR,
        PottyHealthFlag.WORMS
      ];
    }
    return Object.values(PottyHealthFlag);
  }, [formData.type]);

  // Reset to current time when form opens (useful for modal reuse)
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: getCurrentDateTime()
    }));
  }, []); // Only run once when component mounts

  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please try again.');
        setLocationLoading(false);
      }
    );
  };

  const handleHealthFlagToggle = (flag: PottyHealthFlag) => {
    setFormData(prev => ({
      ...prev,
      healthFlags: prev.healthFlags.includes(flag)
        ? prev.healthFlags.filter(f => f !== flag)
        : [...prev.healthFlags, flag]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      dog: dogId,
      date: new Date(formData.date).toISOString(),
      type: formData.type,
      environment: formData.environment,
      healthFlags: formData.healthFlags.length > 0 ? formData.healthFlags : undefined,
      note: formData.note.trim() || undefined,
      coordinates: (formData.useCurrentLocation && currentLocation) ? currentLocation : undefined
    };

    onSubmit(submitData);
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-600 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-800/30';
      case 'medium':
        return 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-600 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-800/30';
      case 'low':
        return 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300 dark:hover:bg-yellow-800/30';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <span className="text-3xl">📝</span>
        Log Potty Break
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date and Time */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date & Time
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, date: getCurrentDateTime() }))}
              className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
            >
              🕐 Set to Now
            </button>
          </div>
          <input
            type="datetime-local"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Defaults to current time - adjust if needed
          </p>
        </div>

        {/* Potty Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(PottyType).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: value }))}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                  formData.type === value
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                <span className="text-2xl">{value === PottyType.PEE ? '💛' : '💩'}</span>
                <span className="font-medium">{value === PottyType.PEE ? 'Pee' : 'Poop'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Environment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Environment
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(PottyEnvironment).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, environment: value }))}
                className={`p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                  formData.environment === value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <span className="text-2xl">{value === PottyEnvironment.INDOORS ? '🏠' : '🌳'}</span>
                <span className="font-medium">{value === PottyEnvironment.INDOORS ? 'Indoor' : 'Outdoor'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location (Optional)
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors disabled:opacity-50"
            >
              {locationLoading ? '📍 Getting...' : '📍 Use Current'}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="useLocation"
              checked={formData.useCurrentLocation}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, useCurrentLocation: e.target.checked }));
                if (e.target.checked && !currentLocation) {
                  getCurrentLocation();
                }
              }}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="useLocation" className="text-sm text-gray-600 dark:text-gray-400">
              Include location data
              {currentLocation && formData.useCurrentLocation && (
                <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                  ✓ Location captured
                </span>
              )}
            </label>
          </div>
        </div>

        {/* Health Flags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Health Flags (Optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {relevantHealthFlags.map(flag => {
              const info = HEALTH_FLAG_INFO[flag];
              return (
                <button
                  key={flag}
                  type="button"
                  onClick={() => handleHealthFlagToggle(flag as PottyHealthFlag)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    formData.healthFlags.includes(flag as PottyHealthFlag)
                      ? `border-${info.color}-500 ${getSeverityColor(info.severity)} ring-2 ring-${info.color}-500/20`
                      : `border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:${getSeverityColor(info.severity)}`
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{info.icon}</span>
                    <span className="text-xs font-medium">{info.label}</span>
                  </div>
                  <p className="text-xs opacity-75">{info.description}</p>
                </button>
              );
            })}
          </div>
          {formData.healthFlags.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {formData.healthFlags.length} health flag{formData.healthFlags.length > 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="note"
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            rows={3}
            placeholder="Any additional observations or notes..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Potty Log
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
