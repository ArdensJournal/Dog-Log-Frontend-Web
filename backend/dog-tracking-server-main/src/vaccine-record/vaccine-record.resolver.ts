import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VaccineRecordService } from './vaccine-record.service';
import { CreateVaccineRecordDto } from './dto/create-vaccine-record.dto';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { VaccineRecordModel } from './vaccine-record.model';
import { FindByDogIdDto } from 'src/shared/dto/find-by-dog-id.dto';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { Types } from 'mongoose';
@Resolver()
@UseGuards(GqlAuthGuard)
export class VaccineRecordResolver {
  constructor(private readonly vaccineRecordService: VaccineRecordService) {}

  @Mutation(() => VaccineRecordModel)
  async createVaccineRecord(
    @Args('createVaccineRecordDto')
    createVaccineRecordDto: CreateVaccineRecordDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.vaccineRecordService.createVaccineRecord(
      createVaccineRecordDto,
      userId,
    );
  }

  @Query(() => [VaccineRecordModel])
  async findAllVaccineRecordsByDog(
    @Args('findByDogIdDto') findByDogIdDto: FindByDogIdDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.vaccineRecordService.findAllVaccineRecordsByDog(
      findByDogIdDto,
      userId,
    );
  }
}
