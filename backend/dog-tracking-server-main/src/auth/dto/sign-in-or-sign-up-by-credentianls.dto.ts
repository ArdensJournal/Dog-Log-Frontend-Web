import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString } from 'class-validator';
@InputType()
export class SignInOrSignUpByCredentialsDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;
}
