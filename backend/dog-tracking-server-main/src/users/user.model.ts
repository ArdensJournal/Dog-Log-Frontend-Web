import { ConfigService } from '@nestjs/config';
import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

@ObjectType()
export class UserModel {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  email: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  profileImageUrl: string;
}
