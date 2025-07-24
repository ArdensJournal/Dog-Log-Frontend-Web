import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { VaccineModel } from 'src/vaccine/vaccine.model';
import { UserModel } from 'src/users/user.model';
import { DogModel } from 'src/dogs/dog.model';
@ObjectType()
export class TaskModel {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field({ description: 'The name of the task' })
  name: string;

  @Field({ description: 'The description of the task', nullable: true })
  description?: string;

  @Field(() => Date, { description: 'The due date of the task' })
  date: Date;

  @Field({
    description: 'The completion status of the task',
    defaultValue: false,
  })
  isCompleted: boolean;

  @Field(() => DogModel, {
    description:
      'The dog of the task, relevant just for all user tasks',
    nullable: true,
  })
  dog?: DogModel;

  @Field(() => VaccineModel, {
    description: 'The vaccine of the task',
    nullable: true,
  })
  vaccine?: VaccineModel;

  @Field(() => UserModel)
  addedBy: UserModel;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
