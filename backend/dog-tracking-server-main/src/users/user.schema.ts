import { ConfigService } from '@nestjs/config';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { compare, hash } from 'bcrypt';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/shared/base-schema';
export type UserDocument = HydratedDocument<User> & {
  comparePassword: (password: string) => Promise<boolean>;
};

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  })
  email: string;

  @Prop({ required: false, select: false })
  password?: string;

  @Prop({})
  name: string;

  @Prop({})
  profileImageUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.method('comparePassword', async function (password: string) {
  return compare(password, this.password!);
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const configService = new ConfigService();

  const saltRounds = configService.get<number>('BCRYPT_SALT_ROUNDS', 10);

  this.password = await hash(this.password, Number(saltRounds));
  next();
});
