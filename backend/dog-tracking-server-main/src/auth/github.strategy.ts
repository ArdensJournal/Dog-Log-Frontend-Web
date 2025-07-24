import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GithubStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID')!,
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL')!,
      scope: ['public_profile', 'user:email'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user: any) => void,
  ) {
    try {
      const { data, statusText } = await this.httpService.axiosRef.get('', {
        headers: {
          Authorization: `token ${accessToken}`,
          'User-Agent': 'your-app-name',
        },
      });
      if (statusText !== 'OK') {
        throw new UnauthorizedException('Invalid access token');
      }
      const primaryEmail = data.find((e) => e.primary && e.verified)?.email;
      if (!primaryEmail) {
        throw new UnauthorizedException('No primary email found');
      }
      const profileImage = profile.photos?.[0]?.value;
      return { primaryEmail, profileImage, displayName: profile.displayName };
    } catch (error) {
      this.logger.error('Failed to validate Github user', error);
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
