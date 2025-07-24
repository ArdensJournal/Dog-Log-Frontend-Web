import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  MaxDate,
  MinLength,
  MinDate,
  IsMongoId,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';
@InputType()
export class CreateTaskDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @Field({ description: 'The description of the task', nullable: true })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @Field(() => Date, { description: 'The due date of the task' })
  @IsDate()
  @MaxDate(() => new Date(new Date().setFullYear(new Date().getFullYear() + 2)))
  date: Date;

  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  dog: Types.ObjectId;

  @Field(() => Boolean, {
    defaultValue: false,
    description: 'The completion status of the task',
  })
  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;

  @Field(() => String, {
    description: 'The vaccine of the task',
    nullable: true,
  })
  @IsOptional()
  @IsMongoId()
  vaccine?: Types.ObjectId;
}
