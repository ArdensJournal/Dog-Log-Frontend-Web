import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';

import { UpsertUserDto } from 'src/users/dto/upsert-user.dto';
import { SignInOrSignUpByCredentialsDto } from './dto/sign-in-or-sign-up-by-credentianls.dto';
import { OAuth2Client } from 'google-auth-library';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signInByGoogle(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token');
    }
    const user = await this.usersService.upsertUser({
      email: payload.email!,
      name: payload.name!,
      profileImageUrl: payload.picture!,
    });
    return this.signIn(user._id);
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.loginByCredentials(email, pass);
    return user;
  }

  async signIn(userId: Types.ObjectId) {
    const payload = {
      user: {
        userId,
      },
    };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      }),

      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '30d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
  }

  async signUpByCredentials(user: UpsertUserDto) {
    const newUser = await this.usersService.signUpByCredentials(user);
    return this.signIn(newUser._id);
  }

  async refreshTokens(
    userId: Types.ObjectId,
    authorization: string,
    exp: number,
  ) {
    try {
      const user = await this.usersService.findById(userId);
      return this.signIn(user._id);
    } catch (err) {
      this.logger.error('Invalid or expired refresh token', err);
      throw new Error('Invalid or expired refresh token');
    }
  }

  async signInByCredentials(
    signInByCredentialsDto: SignInOrSignUpByCredentialsDto,
  ) {
    const user = await this.usersService.loginByCredentials(
      signInByCredentialsDto.email,
      signInByCredentialsDto.password,
    );
    return this.signIn(user._id);
  }

  async signInByProvider(upsertUserDto: UpsertUserDto) {
    const user = await this.usersService.upsertUser(upsertUserDto);
    return this.signIn(user._id);
  }

  async whoAmI(userId: Types.ObjectId) {
    return this.usersService.findById(userId);
  }
}
