'use client';

import { useState, useEffect } from 'react';
import { MdClose, MdCheck, MdCalendarToday, MdPets, MdVaccines } from 'react-icons/md';
import { apiClient, Dog, Vaccine } from '@/app/lib/api-client';

interface TaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [selectedDogId, setSelectedDogId] = useState('');
  const [selectedVaccineName, setSelectedVaccineName] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
    setDate(localDate.toISOString().slice(0, 16)); // Format: YYYY-MM-DDTHH:MM
  }, []);

  // Load dogs and vaccines
  useEffect(() => {
    loadDogs();
    loadVaccines();
  }, []);

  const loadDogs = async () => {
    try {
      const result = await apiClient.getDogs();
      console.log('Dogs API response:', result);
      
      if (result?.data?.userDogs) {
        setDogs(result.data.userDogs);
      } else if (result?.data && Array.isArray(result.data)) {
        // Handle direct data array response
        setDogs(result.data);
      } else {
        console.warn('No dogs data found in response');
        setDogs([]);
      }
    } catch (error) {
      console.error('Failed to load dogs:', error);
      setError('Failed to load dogs. Please try again.');
    }
  };

  const loadVaccines = async () => {
    try {
      const result = await apiClient.getVaccines();
      console.log('Vaccines API response:', result);
      
      if (result?.data?.findAllVaccines) {
        setVaccines(result.data.findAllVaccines);
      } else if (result?.data && Array.isArray(result.data)) {
        // Handle direct data array response
        setVaccines(result.data);
      } else {
        console.warn('No vaccines data found in response');
        setVaccines([]);
      }
    } catch (error) {
      console.error('Failed to load vaccines:', error);
      // Don't show error for vaccines since they're optional
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Task name is required');
      return;
    }
    
    if (name.trim().length < 3) {
      setError('Task name must be at least 3 characters long');
      return;
    }
    
    if (!selectedDogId) {
      setError('Please select a dog');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const taskData: any = {
        name: name.trim(),
        date,
        dog: selectedDogId,
        isCompleted
      };

      // Only add description if it's provided and meets minimum length
      const trimmedDescription = description.trim();
      if (trimmedDescription) {
        if (trimmedDescription.length < 5) {
          setError('Description must be at least 5 characters long or left empty');
          return;
        }
        taskData.description = trimmedDescription;
      }

      // Only add vaccine if it's selected and we have vaccine data
      if (selectedVaccineName) {
        const selectedVaccine = vaccines.find(v => v.name === selectedVaccineName);
        if (selectedVaccine) {
          taskData.vaccine = selectedVaccine._id; // Use MongoDB ObjectId, not name
        }
      }

      await apiClient.createTask(taskData);
      
      // Reset form
      setName('');
      setDescription('');
      const today = new Date();
      const localDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
      setDate(localDate.toISOString().slice(0, 16));
      setSelectedDogId('');
      setSelectedVaccineName('');
      setIsCompleted(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      setError(error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Task Name */}
      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Task Name * (minimum 3 characters)
        </label>
        <input
          type="text"
          id="taskName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="e.g., Vet appointment, Give medication"
          required
          minLength={3}
          disabled={isLoading}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (Optional - minimum 5 characters if provided)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Additional details about the task... (leave empty or use at least 5 characters)"
          disabled={isLoading}
        />
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <MdCalendarToday className="inline w-4 h-4 mr-1" />
          Due Date & Time *
        </label>
        <input
          type="datetime-local"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
          disabled={isLoading}
        />
      </div>

      {/* Dog Selection */}
      <div>
        <label htmlFor="dog" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <MdPets className="inline w-4 h-4 mr-1" />
          Dog *
        </label>
        <select
          id="dog"
          value={selectedDogId}
          onChange={(e) => setSelectedDogId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          required
          disabled={isLoading}
        >
          <option value="">Select a dog</option>
          {dogs.map((dog) => (
            <option key={dog._id} value={dog._id}>
              {dog.name}
            </option>
          ))}
        </select>
      </div>

      {/* Vaccine Selection */}
      <div>
        <label htmlFor="vaccine" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <MdVaccines className="inline w-4 h-4 mr-1" />
          Related Vaccine (Optional)
        </label>
        <select
          id="vaccine"
          value={selectedVaccineName}
          onChange={(e) => setSelectedVaccineName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          disabled={isLoading}
        >
          <option value="">No vaccine</option>
          {vaccines.map((vaccine) => (
            <option key={vaccine._id} value={vaccine.name}>
              {vaccine.name}
            </option>
          ))}
        </select>
      </div>

      {/* Is Completed */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isCompleted"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          disabled={isLoading}
        />
        <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          <MdCheck className="inline w-4 h-4 mr-1" />
          Mark as completed
        </label>
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
