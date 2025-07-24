import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class FindByDogIdDto {
  @Field(() => ID)
  @IsMongoId()
  dogId: Types.ObjectId;
}
