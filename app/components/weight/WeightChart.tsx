'use client';

import { useMemo } from 'react';
import { WeightRecord, WeightChartData, WeightUnit, WEIGHT_UNITS } from '@/app/lib/types/weight';
import { MdTrendingUp, MdTrendingDown, MdTrendingFlat } from 'react-icons/md';

interface WeightChartProps {
  records: WeightRecord[];
  unit?: WeightUnit;
  height?: number;
}

export default function WeightChart({ records, unit = 'kg', height = 300 }: WeightChartProps) {
  const chartData: WeightChartData[] = useMemo(() => {
    if (!records.length) return [];
    
    // Sort by date and convert units
    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sortedRecords.map(record => ({
      date: record.date,
      weight: WEIGHT_UNITS[unit].fromKg(record.value),
      formattedDate: new Date(record.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }));
  }, [records, unit]);

  const stats = useMemo(() => {
    if (chartData.length < 2) return null;

    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    const change = latest.weight - previous.weight;
    const changePercent = (change / previous.weight) * 100;

    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 1) { // Only consider significant changes
      trend = change > 0 ? 'up' : 'down';
    }

    return {
      current: latest.weight,
      previous: previous.weight,
      change: Math.abs(change),
      changePercent: Math.abs(changePercent),
      trend,
      isIncrease: change > 0,
    };
  }, [chartData]);

  if (!chartData.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Weight Chart
        </h3>
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <MdTrendingFlat className="w-8 h-8" />
          </div>
          <p className="text-center">No weight data available yet</p>
          <p className="text-sm text-center mt-1">Add some weight records to see the chart</p>
        </div>
      </div>
    );
  }

  // Calculate chart dimensions and scaling
  const minWeight = Math.min(...chartData.map(d => d.weight));
  const maxWeight = Math.max(...chartData.map(d => d.weight));
  const weightRange = maxWeight - minWeight || 1;
  const padding = weightRange * 0.1; // 10% padding
  
  const chartMin = Math.max(0, minWeight - padding);
  const chartMax = maxWeight + padding;
  const chartRange = chartMax - chartMin;

  const svgHeight = height - 60; // Leave space for axis labels
  const svgWidth = 600;
  const chartWidth = svgWidth - 80; // Leave space for y-axis labels

  const getYPosition = (weight: number) => {
    return svgHeight - ((weight - chartMin) / chartRange) * svgHeight;
  };

  const getXPosition = (index: number) => {
    if (chartData.length === 1) return chartWidth / 2;
    return (index / (chartData.length - 1)) * chartWidth;
  };

  // Generate path for the line chart
  const linePath = chartData.map((point, index) => {
    const x = getXPosition(index) + 40; // Offset for y-axis labels
    const y = getYPosition(point.weight) + 20; // Offset for top padding
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate area path for gradient fill
  const areaPath = `${linePath} L ${getXPosition(chartData.length - 1) + 40} ${svgHeight + 20} L 40 ${svgHeight + 20} Z`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weight Trend
        </h3>
        
        {stats && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.current.toFixed(1)} {WEIGHT_UNITS[unit].symbol}
              </div>
              <div className={`text-sm flex items-center gap-1 ${
                stats.trend === 'up' ? 'text-green-600' :
                stats.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {stats.trend === 'up' ? <MdTrendingUp /> :
                 stats.trend === 'down' ? <MdTrendingDown /> :
                 <MdTrendingFlat />}
                {stats.isIncrease ? '+' : '-'}{stats.change.toFixed(1)} {WEIGHT_UNITS[unit].symbol}
                ({stats.changePercent.toFixed(1)}%)
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative overflow-x-auto">
        <svg 
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="w-full"
          style={{ minWidth: '400px' }}
        >
          {/* Grid lines */}
          <defs>
            <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Y-axis grid lines and labels */}
          {Array.from({ length: 5 }, (_, i) => {
            const weight = chartMin + (chartRange / 4) * i;
            const y = getYPosition(weight) + 20;
            
            return (
              <g key={i}>
                <line
                  x1={40}
                  y1={y}
                  x2={svgWidth - 20}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  strokeDasharray="2,2"
                />
                <text
                  x={35}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                >
                  {weight.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={areaPath}
            fill="url(#weightGradient)"
          />

          {/* Main line */}
          <path
            d={linePath}
            fill="none"
            stroke="rgb(147, 51, 234)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {chartData.map((point, index) => (
            <g key={index}>
              <circle
                cx={getXPosition(index) + 40}
                cy={getYPosition(point.weight) + 20}
                r={5}
                fill="rgb(147, 51, 234)"
                stroke="white"
                strokeWidth={2}
                className="drop-shadow-sm"
              />
              
              {/* Date labels */}
              <text
                x={getXPosition(index) + 40}
                y={svgHeight + 35}
                textAnchor="middle"
                className="text-xs fill-gray-500 dark:fill-gray-400"
              >
                {point.formattedDate}
              </text>
              
              {/* Weight value on hover */}
              <title>
                {point.formattedDate}: {point.weight.toFixed(1)} {WEIGHT_UNITS[unit].symbol}
              </title>
            </g>
          ))}
          
          {/* Unit label */}
          <text
            x={20}
            y={15}
            className="text-xs fill-gray-500 dark:fill-gray-400 font-medium"
          >
            {WEIGHT_UNITS[unit].symbol}
          </text>
        </svg>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>{chartData.length} weight record{chartData.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}
