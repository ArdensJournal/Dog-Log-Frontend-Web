import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VaccineService } from './vaccine.service';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { VaccineModel } from './vaccine.model';
@Resolver()
@UseGuards(GqlAuthGuard)
export class VaccineResolver {
  constructor(private readonly vaccineService: VaccineService) {}

  @Query(() => [VaccineModel])
  async findAllVaccines() {
    return this.vaccineService.findAllVaccines();
  }

  @Mutation(() => VaccineModel)
  async createVaccine(
    @Args('createVaccineDto') createVaccineDto: CreateVaccineDto,
  ) {
    return this.vaccineService.createVaccine(createVaccineDto);
  }
}
