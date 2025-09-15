import { PottyRecord, POTTY_TYPE_INFO, ENVIRONMENT_INFO } from '@/app/lib/types/potty';
import HealthFlagIndicator from './HealthFlagIndicator';
import PottyTypeIcon from '../PottyTypeIcon';

interface PottyCardProps {
  record: PottyRecord;
  className?: string;
}

export default function PottyCard({ record, className = '' }: PottyCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday at ' + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      }) + ' at ' + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const typeInfo = POTTY_TYPE_INFO[record.type];
  const environmentInfo = record.environment ? ENVIRONMENT_INFO[record.environment] : null;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header with type and time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <PottyTypeIcon iconName={typeInfo.icon} />
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {typeInfo.label}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(record.date)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(record.createdAt)}
          </p>
          {record.addedBy.name && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              by {record.addedBy.name}
            </p>
          )}
        </div>
      </div>

      {/* Environment and Location */}
      <div className="flex items-center gap-4 mb-4">
        {environmentInfo && (
          <div className="flex items-center gap-2">
            <span className="text-lg">{environmentInfo.icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {environmentInfo.label}
            </span>
          </div>
        )}
        
        {record.coordinates && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span className="text-sm">📍</span>
            <span className="text-xs">
              {record.coordinates.latitude.toFixed(4)}, {record.coordinates.longitude.toFixed(4)}
            </span>
          </div>
        )}
      </div>

      {/* Health Flags */}
      {record.healthFlags && record.healthFlags.length > 0 && (
        <div className="mb-4">
          <HealthFlagIndicator 
            healthFlags={record.healthFlags} 
            variant="list"
          />
        </div>
      )}

      {/* Note */}
      {record.note && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Note:</span> {record.note}
          </p>
        </div>
      )}

      {/* Quick Health Status */}
      {(!record.healthFlags || record.healthFlags.length === 0) && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <span className="text-sm">✅</span>
          <span className="text-sm font-medium">Normal</span>
        </div>
      )}
    </div>
  );
}
