import { Field, InputType } from '@nestjs/graphql';
import { TimeDurationInput } from 'src/shared/time-duration/time-duration-input-type';
import { VaccineName } from 'src/vaccine/enums/vaccine-name';
import { VaccineType } from 'src/vaccine/enums/vaccine-type';
import { IsEnum, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
@InputType()
export class CreateVaccineDto {
  @Field(() => VaccineName)
  @IsEnum(VaccineName)
  name: VaccineName;

  @Field(() => VaccineType)
  @IsEnum(VaccineType)
  type: VaccineType;

  @Field(() => TimeDurationInput)
  @ValidateNested()
  @Type(() => TimeDurationInput)
  recommendedAge: TimeDurationInput;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  isMandatory: boolean;

  @Field(() => TimeDurationInput)
  @ValidateNested()
  @Type(() => TimeDurationInput)
  recommendedFrequency: TimeDurationInput;
}
