import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/user.schema';
import { Dog } from '../dogs/dog.schema';
import { PottyHealthFlag } from 'src/potties/enums/potty-health-flag.enum';
import { PottyType } from 'src/potties/enums/potty-type.enum';
import { PottyEnvironment } from 'src/potties/enums/potty-environment.enum';
export type PottyDocument = HydratedDocument<Potty>;

@Schema({ timestamps: true, autoIndex: true })
export class Potty {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Dog' })
  dog: Dog;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  addedBy: User;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ required: true, enum: Object.values(PottyType) })
  type: PottyType;

  @Prop({ required: true, enum: Object.values(PottyEnvironment) })
  environment: PottyEnvironment;

  @Prop({ required: false })
  note?: string;

  @Prop({ required: false, type: { latitude: Number, longitude: Number } })
  coordinates?: { latitude: number; longitude: number };

  @Prop({
    type: [String],
    enum: Object.values(PottyHealthFlag),
    required: false,
  })
  healthFlags?: PottyHealthFlag[];

  @Prop()
  createdAt: Date;
}

export const PottySchema = SchemaFactory.createForClass(Potty);
