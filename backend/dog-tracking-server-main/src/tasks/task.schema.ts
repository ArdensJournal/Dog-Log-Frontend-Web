import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Dog } from '../dogs/dog.schema';
import { User } from '../users/user.schema';
import { Vaccine } from 'src/vaccine/vaccine.schema';
import { BaseSchema } from 'src/shared/base-schema';
export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task extends BaseSchema {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: false, minlength: 5 })
  description?: string;

  @Prop({
    required: true,
    max: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    min: new Date(),
  })
  date: Date;

  @Prop({ required: true, default: false })
  isCompleted: boolean;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Dog' })
  dog: Dog;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Vaccine' })
  vaccine?: Vaccine;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  addedBy: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
