'use client';

import { useState, useEffect } from 'react';
import { MdAdd, MdCheck, MdClose, MdCalendarToday, MdPets, MdVaccines, MdRefresh, MdFilterList, MdTrendingUp, MdTaskAlt, MdWarning, MdUndo } from 'react-icons/md';
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

  // Task completion handler
  const handleTaskComplete = async (taskId: string, isCompleted: boolean) => {
    try {
      console.log(`🔄 ${isCompleted ? 'Completing' : 'Uncompleting'} task ${taskId}...`);
      
      // Update the task in local state immediately (optimistic update)
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId 
            ? { ...task, isCompleted } 
            : task
        )
      );

      // Call API to persist the change
      await apiClient.completeTask(taskId, isCompleted);
      
      console.log(`✅ Task ${isCompleted ? 'completed' : 'marked as incomplete'} successfully`);
      
      // No need to reload - the optimistic update already updated the state
      // React will automatically re-render and move the task to the correct section
      
    } catch (error) {
      console.error('Failed to complete/uncomplete task:', error);
      
      // Revert the optimistic update if there's an error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId 
            ? { ...task, isCompleted: !isCompleted } 
            : task
        )
      );
      
      // Show user-friendly error message
      const action = isCompleted ? 'mark as completed' : 'mark as incomplete';
      setError(`Cannot ${action} task: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Auto-clear error after 7 seconds to give user time to read
      setTimeout(() => setError(null), 7000);
    }
  };

  // Note: Task deletion removed per requirements - only completion toggle needed

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
    const overdue = pending.filter(task => isOverdue(task.date, task.isCompleted));
    return { pending, completed, overdue };
  };

  const { pending, completed, overdue } = getTasksByStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading Header */}
          <div className="animate-pulse mb-8">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-64 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-80 mb-8"></div>
          </div>
          
          {/* Loading Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
            ))}
          </div>
          
          {/* Loading Task Cards */}
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No dogs state
  if (dogs.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
              <MdTaskAlt className="text-4xl text-indigo-600" />
              Task Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Keep track of your dog care tasks and reminders
            </p>
          </div>

          {/* No dogs message */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <MdPets className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No Dogs Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You need to add a dog before you can create tasks.
            </p>
            <a
              href="/add-dog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MdPets className="w-5 h-5" />
              Add Your First Dog
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 mobile-bottom-nav-padding">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                <MdTaskAlt className="text-4xl text-indigo-600" />
                Task Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Keep track of your dog care tasks and reminders
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <MdRefresh className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MdAdd className="mr-2 h-5 w-5" />
                New Task
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Section */}
        <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <MdFilterList className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Tasks</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="dogFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Dog
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Dog:
                </span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedDogId('')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      selectedDogId === ''
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-600 hover:text-indigo-600'
                    }`}
                  >
                    <MdTaskAlt className="w-5 h-5" />
                    All Dogs
                  </button>
                  {dogs.map((dog) => (
                    <button
                      key={dog._id}
                      onClick={() => setSelectedDogId(dog._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        selectedDogId === dog._id
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-indigo-600 hover:text-indigo-600'
                      }`}
                    >
                      {dog.imageUrl ? (
                        <img
                          src={dog.imageUrl}
                          alt={dog.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <MdPets className="w-5 h-5" />
                      )}
                      {dog.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error/Info Message */}
        {error && (
          <div className={`mb-8 backdrop-blur-sm border rounded-xl p-6 shadow-lg ${
            error.includes('waiting for backend implementation') 
              ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {error.includes('waiting for backend implementation') ? (
                  <MdWarning className="h-6 w-6 text-amber-500" />
                ) : (
                  <MdClose className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <h3 className={`text-lg font-semibold ${
                  error.includes('waiting for backend implementation')
                    ? 'text-amber-800 dark:text-amber-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {error.includes('waiting for backend implementation') 
                    ? 'Feature Coming Soon!' 
                    : 'Unable to load tasks'
                  }
                </h3>
                <p className={`mt-2 ${
                  error.includes('waiting for backend implementation')
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {error}
                </p>
                {error.includes('waiting for backend implementation') && (
                  <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                    The UI is ready! This message will disappear once the backend is updated.
                  </p>
                )}
              </div>
              <button
                onClick={() => setError(null)}
                className={`ml-3 ${
                  error.includes('waiting for backend implementation')
                    ? 'text-amber-400 hover:text-amber-600'
                    : 'text-red-400 hover:text-red-600'
                } transition-colors`}
              >
                <MdClose className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Tasks"
            value={tasks.length}
            icon={MdTaskAlt}
            color="indigo"
            trend="+2 this week"
          />
          <StatCard
            title="Pending"
            value={pending.length}
            icon={MdCalendarToday}
            color="blue"
            trend={`${Math.round((pending.length / Math.max(tasks.length, 1)) * 100)}% of total`}
          />
          <StatCard
            title="Overdue"
            value={overdue.length}
            icon={MdWarning}
            color="red"
            trend={overdue.length > 0 ? "Needs attention!" : "All caught up!"}
          />
          <StatCard
            title="Completed"
            value={completed.length}
            icon={MdCheck}
            color="green"
            trend={`${Math.round((completed.length / Math.max(tasks.length, 1)) * 100)}% completion`}
          />
        </div>

        {/* Enhanced Task Lists */}
        <div className="space-y-8">
          {/* Overdue Tasks - Priority Section */}
          {overdue.length > 0 && (
            <div className="relative">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-l-4 border-red-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl mr-4">
                      <MdWarning className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Overdue Tasks
                      </h2>
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        {overdue.length} task{overdue.length !== 1 ? 's' : ''} need{overdue.length === 1 ? 's' : ''} immediate attention
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 backdrop-blur-sm rounded-lg px-4 py-2">
                    <span className="text-red-700 dark:text-red-300 text-sm font-semibold">Urgent</span>
                  </div>
                </div>
                <div className="grid gap-4">
                  {overdue.map((task) => (
                    <OverdueTaskCard 
                      key={task._id} 
                      task={task} 
                      onComplete={handleTaskComplete}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pending Tasks */}
          <TaskSection
            title="Upcoming Tasks"
            subtitle={`${pending.length} tasks scheduled`}
            icon={MdCalendarToday}
            tasks={pending.filter(task => !isOverdue(task.date, task.isCompleted))}
            emptyMessage="No upcoming tasks"
            emptySubtext={selectedDogId ? 'No upcoming tasks for selected dog.' : 'All caught up! No upcoming tasks.'}
            gradient="from-blue-500 to-indigo-600"
            onComplete={handleTaskComplete}
          />

          {/* Completed Tasks */}
          {completed.length > 0 && (
            <TaskSection
              title="Completed Tasks"
              subtitle={`${completed.length} tasks completed`}
              icon={MdCheck}
              tasks={completed}
              emptyMessage="No completed tasks"
              emptySubtext="Complete some tasks to see them here."
              gradient="from-green-500 to-emerald-600"
              onComplete={handleTaskComplete}
            />
          )}
        </div>

        {/* Enhanced Task Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-gray-700/50">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">
                    Create New Task
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                  >
                    <MdClose className="h-6 w-6" />
                  </button>
                </div>
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

// Enhanced StatCard Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'indigo' | 'blue' | 'red' | 'green';
  trend?: string;
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 dark:text-indigo-400',
    blue: 'from-blue-500 to-blue-600 text-blue-600 dark:text-blue-400',
    red: 'from-red-500 to-red-600 text-red-600 dark:text-red-400',
    green: 'from-green-500 to-green-600 text-green-600 dark:text-green-400'
  };

  return (
    <div className="relative overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl font-bold ${colorClasses[color].split(' ').slice(2).join(' ')} mb-1 group-hover:scale-110 transition-transform duration-300`}>
            {value}
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </div>
          {trend && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {trend}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${colorClasses[color].split(' ').slice(0, 2).join(' ')} transition-opacity duration-300 rounded-xl`}></div>
    </div>
  );
}

// Enhanced TaskSection Component
interface TaskSectionProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tasks: Task[];
  emptyMessage: string;
  emptySubtext: string;
  gradient: string;
  onComplete?: (taskId: string, isCompleted: boolean) => void;
}

function TaskSection({ title, subtitle, icon: Icon, tasks, emptyMessage, emptySubtext, gradient, onComplete }: TaskSectionProps) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 dark:border-gray-700/50">
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {emptySubtext}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg mr-4`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {tasks.map((task) => (
          <TaskCard 
            key={task._id} 
            task={task} 
            onComplete={onComplete}
          />
        ))}
      </div>
    </div>
  );
}

// Specialized Overdue Task Card - Clean and minimal
interface OverdueTaskCardProps {
  task: Task;
  onComplete?: (taskId: string, isCompleted: boolean) => void;
}

function OverdueTaskCard({ task, onComplete }: OverdueTaskCardProps) {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} overdue`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} overdue`;
      } else {
        return 'Just overdue';
      }
    } catch {
      return 'Overdue';
    }
  };

  const formatOriginalDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border-l-4 border-red-400 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
              {task.name}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              {formatDateTime(task.date)}
            </span>
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <MdPets className="w-4 h-4 mr-1.5 text-indigo-500" />
              <span className="font-medium">{task.dog.name}</span>
            </div>
            <div className="flex items-center">
              <MdCalendarToday className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>Due: {formatOriginalDate(task.date)}</span>
            </div>
            {task.vaccine && (
              <div className="flex items-center">
                <MdVaccines className="w-4 h-4 mr-1.5 text-purple-500" />
                <span>{task.vaccine.name}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {/* Complete Task Button */}
          <button
            onClick={() => onComplete?.(task._id, true)}
            className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 rounded-lg transition-colors group-hover:scale-110 duration-200"
            title="Mark as completed"
          >
            <MdCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
          </button>
          
          {/* Warning Icon */}
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <MdWarning className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Task Card Component
interface TaskCardProps {
  task: Task;
  variant?: 'overdue' | 'normal';
  onComplete?: (taskId: string, isCompleted: boolean) => void;
}

function TaskCard({ task, variant = 'normal', onComplete }: TaskCardProps) {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
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
    <div className={`relative rounded-xl p-6 transition-all duration-300 hover:scale-[1.01] shadow-sm hover:shadow-lg group ${
      task.isCompleted 
        ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50' 
        : isTaskOverdue 
        ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50'
        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50'
    }`}>
      
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <div className={`flex-shrink-0 w-5 h-5 rounded-full mr-4 mt-1 flex items-center justify-center ${
            task.isCompleted 
              ? 'bg-green-500' 
              : isTaskOverdue 
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}>
            {task.isCompleted && <MdCheck className="w-3 h-3 text-white" />}
          </div>
          
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-2 ${
              task.isCompleted 
                ? 'text-gray-500 dark:text-gray-400 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.name}
            </h3>
            
            {task.description && (
              <p className={`text-sm mb-3 leading-relaxed ${
                task.isCompleted 
                  ? 'text-gray-400 dark:text-gray-500' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MdCalendarToday className="w-4 h-4 mr-1.5" />
                <span className={isTaskOverdue && !task.isCompleted ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
                  {formatDateTime(task.date)}
                </span>
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MdPets className="w-4 h-4 mr-1.5 text-indigo-500" />
                <span className="font-medium">{task.dog.name}</span>
              </div>
              
              {task.vaccine && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MdVaccines className="w-4 h-4 mr-1.5 text-purple-500" />
                  <span>{task.vaccine.name}</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              Added by {task.addedBy.name} • {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {task.isCompleted ? (
            <>
              {/* Uncomplete Button */}
              <button
                onClick={() => onComplete?.(task._id, false)}
                className="p-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40 rounded-lg transition-colors opacity-0 group-hover:opacity-100 duration-200"
                title="Mark as incomplete"
              >
                <MdUndo className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </button>
              {/* Completion Indicator */}
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <MdCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </>
          ) : (
            <>
              {/* Complete Button */}
              <button
                onClick={() => onComplete?.(task._id, true)}
                className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/40 rounded-lg transition-colors opacity-0 group-hover:opacity-100 duration-200"
                title="Mark as completed"
              >
                <MdCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
