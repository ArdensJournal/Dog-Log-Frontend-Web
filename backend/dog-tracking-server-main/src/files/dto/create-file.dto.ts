import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class CreateFileDto {
  @IsOptional() // this one is required due to conflict with validation pipe
  @Field(() => GraphQLUpload, { nullable: true })
  image: FileUpload;
}
