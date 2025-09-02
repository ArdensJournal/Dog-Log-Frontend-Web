"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MdPets, 
  MdTask, 
  MdVaccines, 
  MdScale, 
  MdArrowBack,
  MdLocationOn,
  MdFlag,
  MdWarning,
  MdCheckCircle,
  MdInfo,
  MdFilterList,
  MdSelectAll,
  MdPerson,
  MdAccessTime
} from "react-icons/md";

// Types based on your GraphQL schema
interface UserModel {
  _id: string;
  email: string;
  name?: string;
  profileImageUrl?: string;
}

interface DogModel {
  _id: string;
  name: string;
  breed?: string[];
  gender?: 'MALE' | 'FEMALE';
  birthday?: string;
  imageUrl?: string;
}

interface PottyModel {
  _id: string;
  addedBy: UserModel;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  date: string;
  environment: 'INDOORS' | 'OUTDOORS';
  healthFlags?: string[];
  note?: string;
  type: 'PEE' | 'POOP';
}

interface TaskModel {
  _id: string;
  addedBy: UserModel;
  createdAt: string;
  date: string;
  description?: string;
  dog?: DogModel;
  isCompleted: boolean;
  name: string;
  updatedAt: string;
  vaccine?: {
    _id: string;
    name: string;
  };
}

interface VaccineRecordModel {
  _id: string;
  addedBy: UserModel;
  createdAt: string;
  date: string;
  note?: string;
  updatedAt: string;
  vaccine: {
    _id: string;
    name: string;
    type: string;
  };
  validFor: {
    unit: string;
    value: number;
  };
}

interface WeightModel {
  _id: string;
  addedBy: UserModel;
  createdAt: string;
  date: string;
  dog: string;
  value: number;
}

interface RecentActivityItem {
  type: 'POTTY_RECORD' | 'TASK_RECORDS' | 'VACCINE_RECORD' | 'WEIGHT_RECORD';
  dogId: string;
  dogName: string;
  dogImageUrl?: string;
  potty?: PottyModel;
  task?: TaskModel;
  vaccineRecord?: VaccineRecordModel;
  weight?: WeightModel;
}

const RecentActivityPage = () => {
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [dogs, setDogs] = useState<DogModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Fetching all dogs and recent activity...');
      
      // Use the new dedicated API endpoint
      const response = await fetch('/api/recent-activity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response not OK:', response.status, errorText);
        setError(`Failed to fetch data: ${response.status}`);
        return;
      }

      const result = await response.json();
      
      if (result.error) {
        console.error('API returned error:', result.error);
        setError(result.error);
        return;
      }

      const dogs = result.data?.dogs || [];
      const activities = result.data?.activities || [];
      
      console.log(`✅ Fetched ${dogs.length} dogs and ${activities.length} activities`);
      
      setDogs(dogs);
      setActivities(activities);
      
      // Set all dogs as selected by default
      const allDogIds = dogs.map((dog: DogModel) => dog._id);
      setSelectedDogIds(allDogIds);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch recent activity');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} minutes ago`;
      }
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'POTTY_RECORD':
        return <MdPets className="text-amber-600" />;
      case 'TASK_RECORDS':
        return <MdTask className="text-blue-600" />;
      case 'VACCINE_RECORD':
        return <MdVaccines className="text-green-600" />;
      case 'WEIGHT_RECORD':
        return <MdScale className="text-purple-600" />;
      default:
        return <MdInfo className="text-gray-600" />;
    }
  };

  const getHealthFlagColor = (flag: string) => {
    const dangerFlags = ['BLOOD', 'BLOODY_URINE', 'BLACK_TARRY', 'DARK_URINE'];
    const warningFlags = ['DIARRHEA', 'CONSTIPATION', 'FREQUENT_URINATION', 'PAINFUL_URINATION'];
    
    if (dangerFlags.includes(flag)) return 'text-red-600 bg-red-100';
    if (warningFlags.includes(flag)) return 'text-yellow-700 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const toggleDogFilter = (dogId: string) => {
    setSelectedDogIds(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    );
  };

  const toggleAllDogs = () => {
    if (selectedDogIds.length === dogs.length) {
      setSelectedDogIds([]);
    } else {
      setSelectedDogIds(dogs.map(dog => dog._id));
    }
  };

  // Filter activities based on selected dogs
  const filteredActivities = activities.filter(activity => 
    selectedDogIds.includes(activity.dogId)
  );

  const renderActivityContent = (activity: RecentActivityItem) => {
    switch (activity.type) {
      case 'POTTY_RECORD':
        const potty = activity.potty!;
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                potty.type === 'POOP' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {potty.type}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                potty.environment === 'OUTDOORS' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {potty.environment}
              </span>
            </div>
            
            {potty.healthFlags && potty.healthFlags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {potty.healthFlags.map((flag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded-full font-medium ${getHealthFlagColor(flag)}`}
                  >
                    <MdFlag className="inline w-3 h-3 mr-1" />
                    {flag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
            
            {potty.coordinates && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MdLocationOn className="w-4 h-4" />
                <span>{potty.coordinates.latitude.toFixed(4)}, {potty.coordinates.longitude.toFixed(4)}</span>
              </div>
            )}
            
            {potty.note && (
              <p className="text-sm text-gray-700 italic">"{potty.note}"</p>
            )}
          </div>
        );

      case 'TASK_RECORDS':
        const task = activity.task!;
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                task.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {task.isCompleted ? (
                  <>
                    <MdCheckCircle className="inline w-3 h-3 mr-1" />
                    Completed
                  </>
                ) : (
                  'Pending'
                )}
              </span>
            </div>
            
            {task.description && (
              <p className="text-sm text-gray-700">{task.description}</p>
            )}
            
            {task.vaccine && (
              <div className="text-sm text-gray-600">
                <MdVaccines className="inline w-4 h-4 mr-1" />
                Vaccine: {task.vaccine.name}
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              Due: {new Date(task.date).toLocaleDateString()}
            </div>
          </div>
        );

      case 'VACCINE_RECORD':
        const vaccine = activity.vaccineRecord!;
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800">
                {vaccine.vaccine.name}
              </span>
              <span className="px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
                {vaccine.vaccine.type}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              Valid for: {vaccine.validFor.value} {vaccine.validFor.unit.toLowerCase()}
            </div>
            
            {vaccine.note && (
              <p className="text-sm text-gray-700 italic">"{vaccine.note}"</p>
            )}
            
            <div className="text-xs text-gray-500">
              Administered: {new Date(vaccine.date).toLocaleDateString()}
            </div>
          </div>
        );

      case 'WEIGHT_RECORD':
        const weight = activity.weight!;
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-purple-600">
                {weight.value} kg
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              Recorded: {new Date(weight.date).toLocaleDateString()}
            </div>
          </div>
        );

      default:
        return <div>Unknown activity type</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <MdWarning className="w-5 h-5" />
              <span className="font-semibold">Error loading recent activity</span>
            </div>
            <p className="text-red-700 dark:text-red-300 mt-2">{error}</p>
            <Link
              href="/dogs"
              className="mt-4 inline-flex items-center gap-2 text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
            >
              <MdArrowBack />
              Back to Dogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 mb-4"
          >
            <MdArrowBack />
            Back to Profile
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track all recent activities, health records, and tasks for your dogs
          </p>
        </div>

        {/* Dog Filter */}
        {dogs.length > 1 && (
          <div className="mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <MdFilterList className="text-lg" />
              <span>Filter by Dogs ({selectedDogIds.length}/{dogs.length})</span>
            </button>
            
            {showFilters && (
              <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white">Select Dogs</h3>
                  <button
                    onClick={toggleAllDogs}
                    className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    <MdSelectAll className="text-lg" />
                    {selectedDogIds.length === dogs.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {dogs.map((dog) => (
                    <label
                      key={dog._id}
                      className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDogIds.includes(dog._id)}
                        onChange={() => toggleDogFilter(dog._id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-2 min-w-0">
                        {dog.imageUrl ? (
                          <img
                            src={dog.imageUrl}
                            alt={dog.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                            <MdPets className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {dog.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activities Timeline */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MdAccessTime className="w-8 h-8 text-blue-500" />
            Activity Timeline
          </h2>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <MdPets className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {selectedDogIds.length === 0 ? 'No dogs selected' : 'No recent activity'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedDogIds.length === 0 
                ? 'Select one or more dogs to view their activities'
                : 'Start tracking your dogs\' activities to see them here'
              }
            </p>
            
            {/* Demo Timeline when no activities */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-gray-300 rounded-full"></div>
                <div className="space-y-6">
                  <div className="relative flex items-center">
                    <div className="absolute left-4 w-6 h-6 bg-gray-300 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <div className="ml-16 text-left">
                      <p className="text-sm text-gray-500">Your timeline will appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-green-500 rounded-full"></div>
            
            {/* Timeline Activities */}
            <div className="space-y-8 relative z-10">
              {filteredActivities.map((activity, index) => {
                const activityData = activity.potty || activity.task || activity.vaccineRecord || activity.weight;
                const createdAt = activityData?.createdAt || activityData?.date || '';
                const addedBy = activityData?.addedBy;
                
                // Get activity type color and icon
                const getActivityStyle = (type: string) => {
                  switch (type) {
                    case 'POTTY_RECORD': 
                      return { 
                        bg: 'bg-amber-500', 
                        text: 'text-white',
                        border: 'border-amber-300',
                        name: 'Potty Record'
                      };
                    case 'TASK_RECORDS': 
                      return { 
                        bg: 'bg-orange-500', 
                        text: 'text-white',
                        border: 'border-orange-300',
                        name: activity.task?.name || 'Task'
                      };
                    case 'VACCINE_RECORD': 
                      return { 
                        bg: 'bg-green-500', 
                        text: 'text-white',
                        border: 'border-green-300',
                        name: 'Vaccination Record'
                      };
                    case 'WEIGHT_RECORD': 
                      return { 
                        bg: 'bg-purple-500', 
                        text: 'text-white',
                        border: 'border-purple-300',
                        name: 'Weight Record'
                      };
                    default: 
                      return { 
                        bg: 'bg-gray-500', 
                        text: 'text-white',
                        border: 'border-gray-300',
                        name: 'Activity'
                      };
                  }
                };
                
                const style = getActivityStyle(activity.type);
                
                return (
                  <div key={`${activity.type}-${activityData?._id || index}`} className="relative">
                    {/* Timeline Node */}
                    <div className="absolute left-4 top-6 z-20">
                      <div className={`w-6 h-6 rounded-full ${style.bg} ${style.text} border-4 border-white shadow-lg flex items-center justify-center`}>
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    
                    {/* Activity Card */}
                    <div className="ml-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-200">
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {style.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {/* Dog Info */}
                              <div className="flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                                {activity.dogImageUrl ? (
                                  <img
                                    src={activity.dogImageUrl}
                                    alt={activity.dogName}
                                    className="w-4 h-4 rounded-full object-cover"
                                  />
                                ) : (
                                  <MdPets className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                )}
                                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                                  {activity.dogName}
                                </span>
                              </div>
                              
                              {/* Time */}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Large Icon */}
                          <div className={`w-12 h-12 rounded-full ${style.bg} ${style.text} shadow-md flex items-center justify-center`}>
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                          {renderActivityContent(activity)}
                        </div>
                        
                        {/* Footer */}
                        <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <MdPerson className="w-3 h-3 mr-1" />
                          <span>Added by {addedBy?.name || addedBy?.email || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {dogs.length > 0 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/dogs"
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
              >
                <MdPets className="w-8 h-8 text-amber-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Dogs</span>
              </Link>
              
              <Link
                href="/tasks"
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <MdTask className="w-8 h-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View Tasks</span>
              </Link>
              
              <Link
                href="/vaccinations"
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <MdVaccines className="w-8 h-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vaccinations</span>
              </Link>
              
              <Link
                href="/settings"
                className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <MdScale className="w-8 h-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityPage;
