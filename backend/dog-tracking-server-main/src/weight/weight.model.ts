import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { UserModel } from 'src/users/user.model';
@ObjectType()
export class WeightModel {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => Number, { description: 'The weight value in kilograms' })
  value: number;

  @Field(() => UserModel)
  addedBy: UserModel;

  @Field(() => String, {
    description: 'The ID of the dog the weight was recorded for',
  })
  dog: Types.ObjectId;

  @Field(() => Date, {
    description: 'The date and time the weight was recorded',
  })
  date: Date;

  @Field(() => Date, {
    description: 'The date and time the weight was created',
  })
  createdAt: Date;
}
