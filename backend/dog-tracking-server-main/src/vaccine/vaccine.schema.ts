import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { VaccineName } from 'src/vaccine/enums/vaccine-name';
import { VaccineType } from 'src/vaccine/enums/vaccine-type';
import {
  TimeDuration,
  TimeDurationSchema,
} from 'src/shared/time-duration/time-duration.schema';
import { BaseSchema } from 'src/shared/base-schema';

@Schema({ timestamps: true })
export class Vaccine extends BaseSchema {
  @Prop({ required: true, enum: VaccineName })
  name: VaccineName;

  @Prop({ required: true, enum: VaccineType })
  type: VaccineType;

  @Prop({ required: true, type: TimeDurationSchema })
  recommendedAge: TimeDuration;

  @Prop({ default: false })
  isMandatory: boolean;

  @Prop({ type: TimeDurationSchema, required: true })
  recommendedFrequency: TimeDuration;
}

export const VaccineSchema = SchemaFactory.createForClass(Vaccine);
