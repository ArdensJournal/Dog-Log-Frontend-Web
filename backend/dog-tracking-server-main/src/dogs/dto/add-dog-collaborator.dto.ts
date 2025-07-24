import { InputType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsMongoId } from 'class-validator';
import { DogCollaboratorRole } from '../enums/access-role.enum';
import { Types } from 'mongoose';

@InputType()
export class AddDogCollaboratorDto {
  @Field(() => ID)
  @IsMongoId()
  dogId: Types.ObjectId;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => DogCollaboratorRole)
  @IsEnum(DogCollaboratorRole)
  role: DogCollaboratorRole;
}
