// TypeScript interfaces for potty tracking system
// Based on GraphQL schema

export enum PottyType {
  PEE = 'PEE',
  POOP = 'POOP'
}

export enum PottyEnvironment {
  INDOORS = 'INDOORS',
  OUTDOORS = 'OUTDOORS'
}

export enum PottyHealthFlag {
  BLACK_TARRY = 'BLACK_TARRY',
  BLOOD = 'BLOOD',
  BLOODY_URINE = 'BLOODY_URINE',
  CONSTIPATION = 'CONSTIPATION',
  DARK_URINE = 'DARK_URINE',
  DIARRHEA = 'DIARRHEA',
  FREQUENT_URINATION = 'FREQUENT_URINATION',
  MUCUS = 'MUCUS',
  PAINFUL_URINATION = 'PAINFUL_URINATION',
  UNDIGESTED_FOOD = 'UNDIGESTED_FOOD',
  UNUSUAL_COLOR = 'UNUSUAL_COLOR',
  WORMS = 'WORMS'
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PottyRecord {
  _id: string;
  date: string; // ISO date string
  type: PottyType;
  environment: PottyEnvironment;
  healthFlags?: PottyHealthFlag[];
  note?: string;
  coordinates?: Coordinates;
  addedBy: {
    _id: string;
    name?: string;
    email: string;
  };
  createdAt: string;
}

export interface CreatePottyDto {
  date: string; // ISO date string
  dog: string; // Dog ID
  type: PottyType;
  environment?: PottyEnvironment;
  healthFlags?: PottyHealthFlag[];
  note?: string;
  coordinates?: Coordinates;
}

export interface PottyFilters {
  startDate?: string;
  endDate?: string;
  type?: PottyType;
  environment?: PottyEnvironment;
  healthFlags?: PottyHealthFlag[];
}

export interface PottyResponse {
  data: PottyRecord[];
  success: boolean;
  message?: string;
}

export interface CreatePottyResponse {
  data: PottyRecord;
  success: boolean;
  message?: string;
}

// Health flag display information
export const HEALTH_FLAG_INFO: Record<PottyHealthFlag, {
  label: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  color: string;
  icon: string;
}> = {
  [PottyHealthFlag.BLACK_TARRY]: {
    label: 'Black/Tarry Stool',
    description: 'Dark, tar-like appearance may indicate internal bleeding',
    severity: 'high',
    color: 'red',
    icon: '⚠️'
  },
  [PottyHealthFlag.BLOOD]: {
    label: 'Blood in Stool',
    description: 'Visible blood may indicate digestive issues',
    severity: 'high',
    color: 'red',
    icon: '🩸'
  },
  [PottyHealthFlag.BLOODY_URINE]: {
    label: 'Bloody Urine',
    description: 'Blood in urine may indicate urinary tract issues',
    severity: 'high',
    color: 'red',
    icon: '🔴'
  },
  [PottyHealthFlag.CONSTIPATION]: {
    label: 'Constipation',
    description: 'Difficulty or straining during bowel movements',
    severity: 'medium',
    color: 'orange',
    icon: '😣'
  },
  [PottyHealthFlag.DARK_URINE]: {
    label: 'Dark Urine',
    description: 'Unusually dark colored urine',
    severity: 'medium',
    color: 'orange',
    icon: '🟤'
  },
  [PottyHealthFlag.DIARRHEA]: {
    label: 'Diarrhea',
    description: 'Loose or watery stool',
    severity: 'medium',
    color: 'orange',
    icon: '💧'
  },
  [PottyHealthFlag.FREQUENT_URINATION]: {
    label: 'Frequent Urination',
    description: 'More frequent urination than usual',
    severity: 'low',
    color: 'yellow',
    icon: '🔄'
  },
  [PottyHealthFlag.MUCUS]: {
    label: 'Mucus Present',
    description: 'Visible mucus in stool',
    severity: 'low',
    color: 'yellow',
    icon: '🧪'
  },
  [PottyHealthFlag.PAINFUL_URINATION]: {
    label: 'Painful Urination',
    description: 'Signs of discomfort during urination',
    severity: 'medium',
    color: 'orange',
    icon: '😖'
  },
  [PottyHealthFlag.UNDIGESTED_FOOD]: {
    label: 'Undigested Food',
    description: 'Visible undigested food in stool',
    severity: 'low',
    color: 'yellow',
    icon: '🍽️'
  },
  [PottyHealthFlag.UNUSUAL_COLOR]: {
    label: 'Unusual Color',
    description: 'Abnormal coloring of stool or urine',
    severity: 'medium',
    color: 'orange',
    icon: '🌈'
  },
  [PottyHealthFlag.WORMS]: {
    label: 'Worms Visible',
    description: 'Visible worms or parasites in stool',
    severity: 'high',
    color: 'red',
    icon: '🪱'
  }
};

// Environment display information
export const ENVIRONMENT_INFO: Record<PottyEnvironment, {
  label: string;
  icon: string;
  color: string;
}> = {
  [PottyEnvironment.INDOORS]: {
    label: 'Indoor',
    icon: '🏠',
    color: 'blue'
  },
  [PottyEnvironment.OUTDOORS]: {
    label: 'Outdoor',
    icon: '🌳',
    color: 'green'
  }
};

// Potty type display information
export const POTTY_TYPE_INFO: Record<PottyType, {
  label: string;
  icon: string;
  color: string;
}> = {
  [PottyType.PEE]: {
    label: 'Pee',
    icon: '💛',
    color: 'yellow'
  },
  [PottyType.POOP]: {
    label: 'Poop',
    icon: '💩',
    color: 'brown'
  }
};
