import { Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { DogBreed } from 'src/dogs/enums/breed';
import { IsString, IsEnum, IsOptional, IsDate, MaxDate } from 'class-validator';
import { FileUpload } from 'graphql-upload-ts';
import { GraphQLUpload } from 'graphql-upload-ts';
@InputType()
export class UpdateDogDto {
  @Field(() => ID, { nullable: true })
  @IsMongoId()
  dogId: Types.ObjectId;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => [DogBreed], { nullable: true })
  @IsEnum(DogBreed, { each: true })
  @IsOptional()
  breed?: DogBreed[];

  @Field(() => Date, { nullable: true })
  @IsDate()
  @MaxDate(() => new Date())
  @IsOptional()
  birthday?: Date;

  @IsOptional() // this one is required due to conflict with validation pipe
  @Field(() => GraphQLUpload, { nullable: true })
  image?: FileUpload;
}
