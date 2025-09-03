'use client';

import { useState, useEffect } from 'react';
import { MdAdd, MdCheck, MdClose, MdCalendarToday, MdPets, MdVaccines, MdRefresh } from 'react-icons/md';
import { apiClient, Task, Dog } from '@/app/lib/api-client';
import TaskForm from '@/app/components/tasks/TaskForm';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDogId, setSelectedDogId] = useState<string>('');

  // Load tasks and dogs
  useEffect(() => {
    loadData();
  }, [selectedDogId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dogs for filtering
      const dogsResponse = await apiClient.getDogs();
      console.log('Dogs response:', dogsResponse);
      
      if (dogsResponse?.data?.userDogs) {
        setDogs(dogsResponse.data.userDogs);
      } else if (dogsResponse?.data) {
        // Handle direct data array response
        setDogs(dogsResponse.data);
      }

      // Load tasks with optional dog filter
      const tasksResponse = await apiClient.getTasks(
        selectedDogId ? { dogId: selectedDogId } : undefined
      );
      
      console.log('Tasks response:', tasksResponse);
      
      if (tasksResponse?.data) {
        setTasks(tasksResponse.data);
      } else {
        setTasks([]);
      }

    } catch (error) {
      console.error('Error loading tasks:', error);
      setError(error instanceof Error ? error.message : 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    setShowForm(false);
    loadData(); // Reload tasks after creation
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const isOverdue = (dateString: string, isCompleted: boolean) => {
    if (isCompleted) return false;
    try {
      const date = new Date(dateString);
      return date < new Date();
    } catch {
      return false;
    }
  };

  const getTasksByStatus = () => {
    const pending = tasks.filter(task => !task.isCompleted);
    const completed = tasks.filter(task => task.isCompleted);
    return { pending, completed };
  };

  const { pending, completed } = getTasksByStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your dog care tasks and reminders
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              <MdRefresh className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <MdAdd className="mr-2 h-4 w-4" />
              Add Task
            </button>
          </div>
        </div>

        {/* Dog Filter */}
        <div className="mb-6">
          <label htmlFor="dogFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Dog
          </label>
          <select
            id="dogFilter"
            value={selectedDogId}
            onChange={(e) => setSelectedDogId(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Dogs</option>
            {dogs.map((dog) => (
              <option key={dog._id} value={dog._id}>
                {dog.name}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <MdClose className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error loading tasks
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{tasks.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pending.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completed.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed Tasks</div>
          </div>
        </div>

        {/* Task Lists */}
        <div className="space-y-8">
          {/* Pending Tasks */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MdCalendarToday className="mr-2 h-5 w-5" />
              Pending Tasks ({pending.length})
            </h2>
            
            {pending.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <MdCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No pending tasks
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {selectedDogId ? 'No pending tasks for selected dog.' : 'All caught up! No pending tasks.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pending.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MdCheck className="mr-2 h-5 w-5" />
                Completed Tasks ({completed.length})
              </h2>
              
              <div className="grid gap-4">
                {completed.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Create New Task
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <MdClose className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <TaskForm 
                  onSuccess={handleTaskCreated}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Task Card Component
interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const isOverdue = (dateString: string, isCompleted: boolean) => {
    if (isCompleted) return false;
    try {
      const date = new Date(dateString);
      return date < new Date();
    } catch {
      return false;
    }
  };

  const isTaskOverdue = isOverdue(task.date, task.isCompleted);
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border p-6 transition-all hover:shadow-md ${
      task.isCompleted 
        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' 
        : isTaskOverdue 
        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
        : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 mt-1 ${
            task.isCompleted 
              ? 'bg-green-500' 
              : isTaskOverdue 
              ? 'bg-red-500'
              : 'bg-amber-500'
          }`}></div>
          <h3 className={`text-lg font-medium ${
            task.isCompleted 
              ? 'text-gray-500 dark:text-gray-400 line-through' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {task.name}
          </h3>
        </div>
        {task.isCompleted && (
          <MdCheck className="w-5 h-5 text-green-500" />
        )}
      </div>

      {/* Task Description */}
      {task.description && (
        <p className={`text-sm mb-3 ml-6 ${
          task.isCompleted 
            ? 'text-gray-400 dark:text-gray-500' 
            : 'text-gray-600 dark:text-gray-300'
        }`}>
          {task.description}
        </p>
      )}

      {/* Task Details */}
      <div className="flex flex-wrap gap-4 ml-6 text-sm">
        {/* Date */}
        <div className="flex items-center">
          <MdCalendarToday className={`w-4 h-4 mr-1 ${
            isTaskOverdue && !task.isCompleted ? 'text-red-500' : 'text-gray-400'
          }`} />
          <span className={
            isTaskOverdue && !task.isCompleted 
              ? 'text-red-600 dark:text-red-400 font-medium' 
              : task.isCompleted
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-600 dark:text-gray-300'
          }>
            {formatDateTime(task.date)}
            {isTaskOverdue && !task.isCompleted && ' (Overdue)'}
          </span>
        </div>

        {/* Dog */}
        <div className="flex items-center">
          <MdPets className="w-4 h-4 mr-1 text-gray-400" />
          <span className={
            task.isCompleted 
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-gray-600 dark:text-gray-300'
          }>
            {task.dog.name}
          </span>
        </div>

        {/* Vaccine (if applicable) */}
        {task.vaccine && (
          <div className="flex items-center">
            <MdVaccines className="w-4 h-4 mr-1 text-gray-400" />
            <span className={
              task.isCompleted 
                ? 'text-gray-400 dark:text-gray-500' 
                : 'text-gray-600 dark:text-gray-300'
            }>
              {task.vaccine.name}
            </span>
          </div>
        )}
      </div>

      {/* Added by info */}
      <div className="mt-3 ml-6 text-xs text-gray-400 dark:text-gray-500">
        Added by {task.addedBy.name} on {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
