import { InputType, Field, ID } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class RemoveDogCollaboratorDto {
  @Field(() => ID)
  @IsMongoId()
  dogId: Types.ObjectId;

  @Field(() => ID)
  @IsMongoId()
  collaboratorId: Types.ObjectId;
}