import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/shared/base-schema';

@Schema({ timestamps: true })
export class Weight extends BaseSchema {
  @Prop({ required: true, min: 0, max: 250 })
  value: number;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  addedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Dog', index: true })
  dog: Types.ObjectId;

  @Prop({
    required: true,
    validate: {
      validator: (value: Date) => value <= new Date(),
      message: 'Date must not be in the future',
    },
  })
  date: Date;
}

export const WeightSchema = SchemaFactory.createForClass(Weight);
