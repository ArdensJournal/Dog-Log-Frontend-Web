import { PottyHealthFlag, HEALTH_FLAG_INFO } from '@/app/lib/types/potty';

interface HealthFlagIndicatorProps {
  healthFlags: PottyHealthFlag[];
  variant?: 'badge' | 'list' | 'tooltip';
  className?: string;
}

export default function HealthFlagIndicator({ 
  healthFlags, 
  variant = 'badge',
  className = '' 
}: HealthFlagIndicatorProps) {
  if (!healthFlags || healthFlags.length === 0) {
    return null;
  }

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  if (variant === 'badge') {
    // Show count of health flags with highest severity color
    const highestSeverity = healthFlags.reduce((highest, flag) => {
      const flagInfo = HEALTH_FLAG_INFO[flag];
      if (flagInfo.severity === 'high') return 'high';
      if (flagInfo.severity === 'medium' && highest !== 'high') return 'medium';
      if (highest === 'low') return 'low';
      return highest;
    }, 'low' as 'low' | 'medium' | 'high');

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(highestSeverity)} ${className}`}>
        <span className="text-sm">⚠️</span>
        <span>{healthFlags.length} health flag{healthFlags.length > 1 ? 's' : ''}</span>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-2 ${className}`}>
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Health Flags:</h4>
        <div className="space-y-1">
          {healthFlags.map((flag) => {
            const flagInfo = HEALTH_FLAG_INFO[flag];
            return (
              <div 
                key={flag} 
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${getSeverityColor(flagInfo.severity)} mr-2 mb-2`}
              >
                <span>{flagInfo.icon}</span>
                <div>
                  <div className="font-medium">{flagInfo.label}</div>
                  <div className="text-xs opacity-75">{flagInfo.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'tooltip') {
    return (
      <div className={`group relative ${className}`}>
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border cursor-help ${getSeverityColor(
          healthFlags.reduce((highest, flag) => {
            const flagInfo = HEALTH_FLAG_INFO[flag];
            if (flagInfo.severity === 'high') return 'high';
            if (flagInfo.severity === 'medium' && highest !== 'high') return 'medium';
            if (highest === 'low') return 'low';
            return highest;
          }, 'low' as 'low' | 'medium' | 'high')
        )}`}>
          <span className="text-sm">⚠️</span>
          <span>{healthFlags.length}</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg p-3 shadow-lg min-w-64 max-w-80">
            <div className="space-y-2">
              {healthFlags.map((flag) => {
                const flagInfo = HEALTH_FLAG_INFO[flag];
                return (
                  <div key={flag} className="flex items-start gap-2">
                    <span className="flex-shrink-0">{flagInfo.icon}</span>
                    <div>
                      <div className="font-medium">{flagInfo.label}</div>
                      <div className="text-xs opacity-75">{flagInfo.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
