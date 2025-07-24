import { Field } from '@nestjs/graphql';

import { InputType } from '@nestjs/graphql';

import { ObjectType } from '@nestjs/graphql';

import { Prop } from '@nestjs/mongoose';

@ObjectType()
@InputType('CoordinatesInput')
export class Coordinates {
  @Field(() => Number)
  @Prop({ required: true })
  latitude: number;

  @Field(() => Number)
  @Prop({ required: true })
  longitude: number;
}
