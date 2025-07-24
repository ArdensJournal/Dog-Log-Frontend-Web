import { registerEnumType } from '@nestjs/graphql';

export enum RecentActivityType {
  VACCINE_RECORD = 'VACCINE RECORD',
  POTTY_RECORD = 'POTTY RECORD',
  TASK_RECORDS = 'TASK RECORDS',
  WEIGHT_RECORD = 'WEIGHT RECORD',
}

registerEnumType(RecentActivityType, {
  name: 'RecentActivityType',
});
