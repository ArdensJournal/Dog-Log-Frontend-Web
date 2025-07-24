import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInOrSignUpByCredentialsDto } from './dto/sign-in-or-sign-up-by-credentianls.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { GqlRefreshGuard } from './guards/gql-refresh.guard';
import { UserModel } from 'src/users/user.model';
import { AuthModel } from './authModel';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { Types } from 'mongoose';
import { AuthToken } from 'src/common/decorators/auth-token.decorator';
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthModel)
  async signUpByCredentials(
    @Args('signUpByCredentialsDto')
    signUpByCredentialsDto: SignInOrSignUpByCredentialsDto,
  ) {
    return this.authService.signUpByCredentials(signUpByCredentialsDto);
  }

  @Mutation(() => AuthModel)
  async signInByGoogle(@AuthToken() googleIdToken: string) {
    return this.authService.signInByGoogle(googleIdToken);
  }

  @Mutation(() => AuthModel)
  async signInByCredentials(
    @Args('signInByCredentialsDto')
    signInByCredentialsDto: SignInOrSignUpByCredentialsDto,
  ) {
    return this.authService.signInByCredentials(signInByCredentialsDto);
  }

  @Query(() => UserModel)
  @UseGuards(GqlAuthGuard)
  async whoAmI(@CurrentUserId() userId: Types.ObjectId) {
    return this.authService.whoAmI(userId);
  }

  @UseGuards(GqlRefreshGuard)
  @Mutation(() => AuthModel)
  async refreshToken(
    @CurrentUserId() userId: Types.ObjectId,
    @Context() context,
  ) {
    const exp = context.req.user.exp;
    const token = context.req.headers?.authorization?.split(' ')[1];
    return this.authService.refreshTokens(userId, token, exp);
  }
}
