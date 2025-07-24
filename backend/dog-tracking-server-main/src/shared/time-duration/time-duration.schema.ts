import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';
import { TimeDurationUnit } from 'src/shared/time-duration/time-duration-unit';
@Schema({ timestamps: false, _id: false })
export class TimeDuration {
  @Prop({ required: true, type: Number })
  value: number;

  @Prop({
    required: true,
    enum: TimeDurationUnit,
    default: TimeDurationUnit.Weeks,
  })
  unit: TimeDurationUnit;
}

export const TimeDurationSchema = SchemaFactory.createForClass(TimeDuration);
