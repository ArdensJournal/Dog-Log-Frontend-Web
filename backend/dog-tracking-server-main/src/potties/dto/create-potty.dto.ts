import { Field, ID, InputType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { PottyEnvironment } from 'src/potties/enums/potty-environment.enum';
import { PottyHealthFlag } from 'src/potties/enums/potty-health-flag.enum';
import { PottyType } from 'src/potties/enums/potty-type.enum';
import {
  IsMongoId,
  IsDate,
  MaxDate,
  IsEnum,
  IsString,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Coordinates } from 'src/shared/coordinates.model';
@InputType()
export class CreatePottyDto {
  @Field(() => ID)
  @IsMongoId()
  dog: Types.ObjectId;

  @Field(() => Date)
  @IsDate()
  @MaxDate(() => new Date())
  date: Date;

  @Field(() => PottyType)
  @IsEnum(PottyType)
  type: PottyType;

  @Field(() => PottyEnvironment, { nullable: true })
  @IsEnum(PottyEnvironment)
  environment?: PottyEnvironment;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field(() => [PottyHealthFlag], { nullable: 'itemsAndList' })
  @IsEnum(PottyHealthFlag, { each: true })
  @IsOptional()
  healthFlags?: PottyHealthFlag[];

  @Field(() => Coordinates, { nullable: true })
  @ValidateNested()
  @Type(() => Coordinates)
  @IsOptional()
  coordinates?: Coordinates;
}
