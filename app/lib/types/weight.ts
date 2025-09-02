export interface WeightRecord {
  _id: string;
  value: number; // Weight in kg
  date: string; // ISO date string
  createdAt: string;
  addedBy: {
    _id: string;
    name?: string;
    email: string;
  };
}

export interface CreateWeightDto {
  dog: string; // Dog ID
  value: number; // Weight in kg
  date: string; // ISO date string
}

export interface WeightStats {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  totalRecords: number;
  firstRecordDate?: string;
  lastRecordDate?: string;
}

export interface WeightChartData {
  date: string;
  weight: number;
  formattedDate: string;
}

export interface WeightResponse {
  success: boolean;
  data: WeightRecord[];
  message?: string;
}

export interface CreateWeightResponse {
  success: boolean;
  data: WeightRecord;
  message?: string;
}

// Weight units conversion
export const WEIGHT_UNITS = {
  kg: {
    label: 'Kilograms (kg)',
    symbol: 'kg',
    toKg: (value: number) => value,
    fromKg: (value: number) => value,
  },
  lb: {
    label: 'Pounds (lb)',
    symbol: 'lb',
    toKg: (value: number) => value * 0.453592,
    fromKg: (value: number) => value / 0.453592,
  },
} as const;

export type WeightUnit = keyof typeof WEIGHT_UNITS;
