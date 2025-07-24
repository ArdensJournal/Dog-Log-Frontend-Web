import { Field, ID, ObjectType } from '@nestjs/graphql';
import { VaccineModel } from 'src/vaccine/vaccine.model';
import { TimeDurationModel } from 'src/shared/time-duration/time-duration.model';
import { Types } from 'mongoose';
import { UserModel } from 'src/users/user.model';
@ObjectType()
export class VaccineRecordModel {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => VaccineModel)
  vaccine: VaccineModel;

  @Field(() => Date)
  date: Date;

  @Field(() => TimeDurationModel)
  validFor: TimeDurationModel;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => UserModel)
  addedBy: UserModel;

  @Field(() => String, { nullable: true })
  note: string;
}
