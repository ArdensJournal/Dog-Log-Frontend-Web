import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import { UpsertUserDto } from './dto/upsert-user.dto';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async upsertUser(user: UpsertUserDto) {
    return await this.userModel.findOneAndUpdate({ email: user.email }, user, {
      new: true,
      upsert: true,
    });
  }

  async loginByCredentials(email: string, password: string) {
    const userByEmail = await this.userModel
      .findOne({ email })
      .select('+password')
      .orFail();
    const isPasswordValid = await userByEmail.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    delete userByEmail.password;
    return userByEmail;
  }
  async findById(id: Types.ObjectId) {
    return this.userModel.findById(id).orFail();
  }

  async signUpByCredentials(user: UpsertUserDto) {
    return this.userModel.create(user);
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).orFail();
  }
}
