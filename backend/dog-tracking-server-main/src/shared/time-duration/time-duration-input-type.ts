import { InputType, Int } from '@nestjs/graphql';

import { Field } from '@nestjs/graphql';
import { TimeDurationUnit } from './time-duration-unit';
import { IsInt, IsNumber, Min, IsEnum } from 'class-validator';
@InputType()
export class TimeDurationInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  value: number;

  @Field(() => TimeDurationUnit)
  @IsEnum(TimeDurationUnit)
  unit: TimeDurationUnit;
}
