import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TimeDurationUnit } from 'src/shared/time-duration/time-duration-unit';
@ObjectType()
export class TimeDurationModel {
  @Field(() => Int)
  value: number;

  @Field(() => TimeDurationUnit)
  unit: TimeDurationUnit;
}
registerEnumType(TimeDurationUnit, {
  name: 'TimeDurationUnit',
  description: 'The time duration of the vaccine',
});
    