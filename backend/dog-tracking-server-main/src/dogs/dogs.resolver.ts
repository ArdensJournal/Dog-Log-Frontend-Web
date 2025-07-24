import { Query, Resolver, Context, Mutation, Args } from '@nestjs/graphql';
import { DogModel } from './dog.model';
import { DogsService } from './dogs.service';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { Types } from 'mongoose';
import { AddDogCollaboratorDto } from './dto/add-dog-collaborator.dto';
import { RemoveDogCollaboratorDto } from './dto/remove-dog-collaborator.dto';
@Resolver()
@UseGuards(GqlAuthGuard)
export class DogsResolver {
  constructor(private readonly dogService: DogsService) {}

  @Query(() => [DogModel])
  async userDogs(@CurrentUserId() userId: Types.ObjectId) {
    return this.dogService.findUserDogs(userId);
  }

  @Mutation(() => DogModel)
  async createDog(
    @Args('createDogDto') createDogDto: CreateDogDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.dogService.createDog(createDogDto, userId);
  }

  @Mutation(() => DogModel)
  async updateDog(
    @Args('updateDogDto') updateDogDto: UpdateDogDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.dogService.updateDog(updateDogDto, userId);
  }

  @Mutation(() => DogModel)
  async addDogCollaborator(
    @Args('addDogCollaboratorDto') addDogCollaboratorDto: AddDogCollaboratorDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.dogService.addDogCollaborator(addDogCollaboratorDto, userId);
  }

  @Mutation(() => DogModel)
  async removeDogCollaborator(
    @Args('removeDogCollaboratorDto') removeDogCollaboratorDto: RemoveDogCollaboratorDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.dogService.removeDogCollaborator(
      removeDogCollaboratorDto,
      userId,
    );
  }
}
