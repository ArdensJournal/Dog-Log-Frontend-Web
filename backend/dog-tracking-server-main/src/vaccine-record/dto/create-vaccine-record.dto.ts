import { Field, ID, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { TimeDurationInput } from 'src/shared/time-duration/time-duration-input-type';
import {
  IsMongoId,
  IsDate,
  MaxDate,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
@InputType()
export class CreateVaccineRecordDto {
  @Field(() => ID)
  @IsMongoId()
  vaccine: Types.ObjectId;
  @Field(() => ID)
  @IsMongoId()
  dog: Types.ObjectId;
  @Field(() => Date)
  @IsDate()
  @MaxDate(() => new Date())
  date: Date;
  @Field(() => TimeDurationInput)
  @ValidateNested()
  @Type(() => TimeDurationInput)
  validFor: TimeDurationInput;
  @Field(() => Date, { nullable: true })
  @IsDate()
  @MaxDate(() => new Date(new Date().setFullYear(new Date().getFullYear() + 1)))
  @IsOptional()
  nextVaccinationDate?: Date;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  note?: string;
}
