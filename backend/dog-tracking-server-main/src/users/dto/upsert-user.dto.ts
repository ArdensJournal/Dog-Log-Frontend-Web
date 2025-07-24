import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
@InputType()
export class UpsertUserDto {
  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  profileImageUrl?: string;
}
