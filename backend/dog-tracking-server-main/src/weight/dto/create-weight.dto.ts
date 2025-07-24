import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsMongoId,
  IsNumber,
  Max,
  MaxDate,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class CreateWeightDto {
  @Field(() => ID)
  @IsMongoId()
  dog: Types.ObjectId;

  @Field(() => Number)
  @IsNumber()
  @Min(0.1)
  @Max(250)
  value: number;

  @Field(() => Date)
  @IsDate()
  @MaxDate(() => new Date())
  date: Date;
}
