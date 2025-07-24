import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PottiesService } from './potties.service';
import { PottyModel } from 'src/potties/potty.model';
import { CreatePottyDto } from './dto/create-potty.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { Types } from 'mongoose';
import { FindByDogIdDto } from 'src/shared/dto/find-by-dog-id.dto';
@Resolver()
export class PottiesResolver {
  constructor(private readonly pottiesService: PottiesService) {}

  @Mutation(() => PottyModel)
  @UseGuards(GqlAuthGuard)
  createPotty(
    @Args('createPottyDto') createPottyDto: CreatePottyDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.pottiesService.createPotty(createPottyDto, userId);
  }

  @Query(() => [PottyModel])
  @UseGuards(GqlAuthGuard)
  findPottyByDogId(
    @Args('findByDogIdDto') findByDogIdDto: FindByDogIdDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.pottiesService.findPottyByDogId(findByDogIdDto, userId);
  }
}
