import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PottyType } from './enums/potty-type.enum';
import { PottyEnvironment } from './enums/potty-environment.enum';
import { Coordinates } from 'src/shared/coordinates.model';
import { PottyHealthFlag } from './enums/potty-health-flag.enum';
import { Types } from 'mongoose';
import { UserModel } from 'src/users/user.model';
@ObjectType()
export class PottyModel {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field(() => UserModel)
  addedBy: UserModel;

  @Field(() => Date)
  date: Date;

  @Field(() => PottyType)
  type: PottyType;

  @Field(() => PottyEnvironment)
  environment: PottyEnvironment;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => Coordinates, { nullable: true })
  coordinates?: Coordinates;

  @Field(() => [PottyHealthFlag], { nullable: 'itemsAndList' })
  healthFlags?: PottyHealthFlag[];

  @Field(() => Date)
  createdAt: Date;
}

registerEnumType(PottyType, {
  name: 'PottyType',
});

registerEnumType(PottyEnvironment, {
  name: 'PottyEnvironment',
});

registerEnumType(PottyHealthFlag, {
  name: 'PottyHealthFlag',
});
