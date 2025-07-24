import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  async signInByGithub(
    @Req()
    req: {
      user: { primaryEmail: string; profileImage: string; displayName: string };
    },
  ) {
    const { primaryEmail, profileImage, displayName } = req.user;
    return this.authService.signInByProvider({
      name: displayName,
      email: primaryEmail,
      profileImageUrl: profileImage,
    });
  }

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async signInByGoogle(
    @Req()
    req: {
      user: { email: string; profileImage: string; displayName: string };
    },
  ) {
    const { displayName, email, profileImage } = req.user;
    return this.authService.signInByProvider({
      name: displayName,
      email,
      profileImageUrl: profileImage,
    });
  }
}
