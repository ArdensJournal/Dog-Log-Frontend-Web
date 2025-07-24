import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { DogBreed } from 'src/dogs/enums/breed';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
  MaxDate,
} from 'class-validator';
import { Gender } from '../enums/gender';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
@InputType()
export class CreateDogDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => [DogBreed], { nullable: true })
  @IsEnum(DogBreed, { each: true })
  @IsOptional()
  breed?: DogBreed[];

  @Field(() => Date, { nullable: true })
  @IsDate()
  @MaxDate(() => new Date())
  @IsOptional()
  birthday?: Date;

  @Field(() => Gender, { nullable: true })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsOptional() // this one is required due to conflict with validation pipe
  @Field(() => GraphQLUpload, { nullable: true })
  image?: FileUpload;
}

registerEnumType(Gender, {
  name: 'Gender',
});
