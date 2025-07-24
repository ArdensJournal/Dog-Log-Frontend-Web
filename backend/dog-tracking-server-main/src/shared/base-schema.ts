import { Schema } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';

@Schema()
export class BaseSchema {
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: Date.now })
  updatedAt: Date;
}
