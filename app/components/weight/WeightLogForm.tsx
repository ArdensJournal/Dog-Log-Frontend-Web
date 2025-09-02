'use client';

import { useState } from 'react';
import { MdClose, MdScale, MdCalendarToday, MdSave, MdCancel } from 'react-icons/md';
import { CreateWeightDto, WeightUnit, WEIGHT_UNITS } from '@/app/lib/types/weight';

interface WeightLogFormProps {
  dogId: string;
  dogName: string;
  onSubmit: (data: CreateWeightDto) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isModal?: boolean;
  defaultUnit?: WeightUnit;
}

export default function WeightLogForm({ 
  dogId, 
  dogName, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  isModal = false,
  defaultUnit = 'kg'
}: WeightLogFormProps) {
  // Helper function to get current datetime in the correct format for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);
    return localTime.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    weight: '',
    date: getCurrentDateTime(),
    unit: defaultUnit
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.weight || isNaN(parseFloat(formData.weight))) {
      newErrors.weight = 'Please enter a valid weight';
    } else {
      const weight = parseFloat(formData.weight);
      if (weight <= 0) {
        newErrors.weight = 'Weight must be greater than 0';
      } else if (weight > 200) {
        newErrors.weight = 'Please check the weight value';
      }
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date and time';
    } else {
      const selectedDate = new Date(formData.date);
      const now = new Date();
      if (selectedDate > now) {
        newErrors.date = 'Date cannot be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert weight to kg if needed
    const weightInKg = WEIGHT_UNITS[formData.unit].toKg(parseFloat(formData.weight));

    const submitData: CreateWeightDto = {
      dog: dogId,
      value: parseFloat(weightInKg.toFixed(2)), // Round to 2 decimal places
      date: new Date(formData.date).toISOString(),
    };

    onSubmit(submitData);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, weight: e.target.value }));
    if (errors.weight) {
      setErrors(prev => ({ ...prev, weight: '' }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: '' }));
    }
  };

  const handleUnitChange = (unit: WeightUnit) => {
    if (formData.weight && !isNaN(parseFloat(formData.weight))) {
      // Convert current weight to kg, then to new unit
      const currentWeightKg = WEIGHT_UNITS[formData.unit].toKg(parseFloat(formData.weight));
      const newWeight = WEIGHT_UNITS[unit].fromKg(currentWeightKg);
      setFormData(prev => ({ 
        ...prev, 
        unit, 
        weight: newWeight.toFixed(2)
      }));
    } else {
      setFormData(prev => ({ ...prev, unit }));
    }
  };

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MdScale className="text-purple-600" />
              Log Weight for {dogName}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              disabled={isLoading}
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <WeightFormFields 
              formData={formData}
              errors={errors}
              isLoading={isLoading}
              onWeightChange={handleWeightChange}
              onDateChange={handleDateChange}
              onUnitChange={handleUnitChange}
            />
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <MdSave />
                    Save Weight
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <MdCancel />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MdScale className="text-purple-600" />
          Log Weight for {dogName}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <WeightFormFields 
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          onWeightChange={handleWeightChange}
          onDateChange={handleDateChange}
          onUnitChange={handleUnitChange}
        />
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <MdSave />
                Save Weight
              </>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <MdCancel />
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Separate component for form fields to reduce duplication
function WeightFormFields({ formData, errors, isLoading, onWeightChange, onDateChange, onUnitChange }: any) {
  return (
    <>
      {/* Weight Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Weight *
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.1"
            min="0"
            max="200"
            value={formData.weight}
            onChange={onWeightChange}
            disabled={isLoading}
            className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.weight ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter weight"
          />
          
          {/* Unit Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {(Object.keys(WEIGHT_UNITS) as WeightUnit[]).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => onUnitChange(unit)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  formData.unit === unit
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {WEIGHT_UNITS[unit].symbol}
              </button>
            ))}
          </div>
        </div>
        {errors.weight && <p className="text-sm text-red-600">{errors.weight}</p>}
      </div>

      {/* Date Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <MdCalendarToday className="w-4 h-4" />
          Date & Time *
        </label>
        <input
          type="datetime-local"
          value={formData.date}
          onChange={onDateChange}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
      </div>
    </>
  );
}
