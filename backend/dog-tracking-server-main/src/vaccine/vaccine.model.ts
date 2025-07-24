import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { VaccineType } from './enums/vaccine-type';
import { VaccineName } from './enums/vaccine-name';
import { TimeDurationModel } from 'src/shared/time-duration/time-duration.model';
@ObjectType()
export class VaccineModel {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => VaccineName)
  name: VaccineName;

  @Field(() => VaccineType)
  type: VaccineType;

  @Field(() => TimeDurationModel)
  recommendedAge: TimeDurationModel;

  @Field(() => Boolean)
  isMandatory: boolean;

  @Field(() => TimeDurationModel)
  recommendedFrequency: TimeDurationModel;
}

registerEnumType(VaccineName, {
  name: 'VaccineName',
  description: 'The name of the vaccine',
});

registerEnumType(VaccineType, {
  name: 'VaccineType',
  description: 'The type of the vaccine',
});
