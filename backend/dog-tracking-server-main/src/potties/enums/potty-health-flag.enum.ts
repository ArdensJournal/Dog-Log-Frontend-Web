import { PottyType } from './potty-type.enum';
export enum PottyHealthFlag {
  // Poop-related flags
  DIARRHEA = 'diarrhea',
  CONSTIPATION = 'constipation',
  BLOOD = 'blood',
  MUCUS = 'mucus',
  BLACK_TARRY = 'black_tarry',
  UNUSUAL_COLOR = 'unusual_color',
  WORMS = 'worms',
  UNDIGESTED_FOOD = 'undigested_food',

  // Pee-related flags
  BLOODY_URINE = 'bloody_urine',
  DARK_URINE = 'dark_urine',
  FREQUENT_URINATION = 'frequent_urination',
  PAINFUL_URINATION = 'painful_urination',
}

export const PoopHealthFlags: PottyHealthFlag[] = [
  PottyHealthFlag.DIARRHEA,
  PottyHealthFlag.CONSTIPATION,
  PottyHealthFlag.BLOOD,
  PottyHealthFlag.MUCUS,
  PottyHealthFlag.BLACK_TARRY,
  PottyHealthFlag.UNUSUAL_COLOR,
  PottyHealthFlag.WORMS,
  PottyHealthFlag.UNDIGESTED_FOOD,
];

export const PeeHealthFlags: PottyHealthFlag[] = [
  PottyHealthFlag.BLOODY_URINE,
  PottyHealthFlag.DARK_URINE,
  PottyHealthFlag.FREQUENT_URINATION,
  PottyHealthFlag.PAINFUL_URINATION,
];

export const getHealthFlagsByPottyType = (
  type: PottyType,
): PottyHealthFlag[] =>
  type === PottyType.POOP ? PoopHealthFlags : PeeHealthFlags;
