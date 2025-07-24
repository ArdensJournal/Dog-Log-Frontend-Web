import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
export class GetUserTasksDto {
  @Field(() => ID, { nullable: true })
  @IsMongoId()
  @IsOptional()
  dogId?: Types.ObjectId;
}
