import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DogBreed } from 'src/dogs/enums/breed';
import { User } from 'src/users/user.schema';
import { Gender } from './enums/gender';
import { DogAccessRole, DogCollaboratorRole } from './enums/access-role.enum';

export type DogDocument = HydratedDocument<Dog>;

@Schema({ timestamps: true })
export class Dog {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: String, enum: Object.values(DogBreed) }] })
  breed: DogBreed[];

  @Prop({ type: Date })
  birthday?: Date;

  @Prop({ enum: Object.values(Gender) })
  gender?: Gender;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({
    type: String,
    match: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  })
  imageUrl?: string;

  @Prop([
    {
      _id: false,
      user: { type: Types.ObjectId, ref: 'User', required: true },
      role: {
        type: String,
        enum: Object.values(DogCollaboratorRole),
        required: true,
      },
    },
  ])
  collaborators?: {
    user: Types.ObjectId;
    role: DogAccessRole;
  }[];
}

export const DogSchema = SchemaFactory.createForClass(Dog);
