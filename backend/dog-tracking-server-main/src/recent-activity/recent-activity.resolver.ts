import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { RecentActivityService } from './recent-activity.service';
import { RecentActivityResponseDto } from './dto/recent-activity-response.dto';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { FindByDogIdDto } from 'src/shared/dto/find-by-dog-id.dto';
@Resolver()
@UseGuards(GqlAuthGuard)
export class RecentActivityResolver {
  constructor(private readonly recentActivityService: RecentActivityService) {}

  @Query(() => [RecentActivityResponseDto])
  async recentActivity(
    @Args('findByDogIdDto') findByDogIdDto: FindByDogIdDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.recentActivityService.getRecentActivityByDog(
      findByDogIdDto,
      userId,
    );
  }
}
