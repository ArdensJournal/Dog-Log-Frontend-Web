import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Vaccine } from '../vaccine/vaccine.schema';
import { User } from '../users/user.schema';
import { TimeDurationSchema } from 'src/shared/time-duration/time-duration.schema';
import { TimeDuration } from 'src/shared/time-duration/time-duration.schema';
import { Dog } from 'src/dogs/dog.schema';
import { BaseSchema } from 'src/shared/base-schema';
@Schema({ timestamps: true })
export class VaccineRecord extends BaseSchema {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Vaccine' })
  vaccine: Vaccine;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Dog' })
  dog: Dog;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: TimeDurationSchema, required: true })
  validFor: TimeDuration;


  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  addedBy: User;

  @Prop({ required: false })
  note: string;
}

export const VaccineRecordSchema = SchemaFactory.createForClass(VaccineRecord);
