import { registerEnumType } from '@nestjs/graphql';

export enum TimeDurationUnit {
  Days = 'days',
  Weeks = 'weeks',
  Months = 'months',
  Years = 'years',
}
