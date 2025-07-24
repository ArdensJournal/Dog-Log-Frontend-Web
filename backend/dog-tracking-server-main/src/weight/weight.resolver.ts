import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { WeightService } from './weight.service';
import { CreateWeightDto } from './dto/create-weight.dto';
import { Types } from 'mongoose';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { FindByDogIdDto } from 'src/shared/dto/find-by-dog-id.dto';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { Query } from '@nestjs/graphql';
import { WeightModel } from './weight.model';
@Resolver()
@UseGuards(GqlAuthGuard)
export class WeightResolver {
  constructor(private readonly weightService: WeightService) {}

  @Mutation(() => WeightModel)
  createWeight(
    @Args('createWeightDto') createWeightDto: CreateWeightDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.weightService.createWeight(createWeightDto, userId);
  }

  @Query(() => [WeightModel])
  findWeightsByDog(
    @Args('findByDogIdDto') findByDogIdDto: FindByDogIdDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.weightService.findWeightsByDog(findByDogIdDto, userId);
  }
}
