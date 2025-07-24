import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { DogsService } from 'src/dogs/dogs.service';
import { Weight } from 'src/weight/weight.schema';
import { CreateWeightDto } from './dto/create-weight.dto';
import { FindByDogIdDto } from 'src/shared/dto/find-by-dog-id.dto';
import { DogAccessRole } from 'src/dogs/enums/access-role.enum';
@Injectable()
export class WeightService {
  constructor(
    @InjectModel(Weight.name) private weightModel: Model<Weight>,
    private dogsService: DogsService,
  ) {}

  async createWeight(
    createWeightDto: CreateWeightDto,
    userId: Types.ObjectId,
  ): Promise<Weight> {
    await this.dogsService.verifyDogPermission({
      dogId: createWeightDto.dog,
      userId,
      requiredRole: DogAccessRole.Editor,
    });
    return this.weightModel.create({
      ...createWeightDto,
      addedBy: userId,
    });
  }

  async findWeightsByDog(
    findByDogIdDto: FindByDogIdDto,
    userId: Types.ObjectId,
  ) {
      await this.dogsService.verifyDogPermission({
      dogId: findByDogIdDto.dogId,
      userId,
      requiredRole: DogAccessRole.Viewer,
    });
    return this.weightModel.find({ dog: findByDogIdDto.dogId });
  }

  async findLastWeightByDog({
    dogId,
    limit = 3,
  }: {
    dogId: Types.ObjectId;
    limit: number;
  }) {
    const weights = await this.weightModel
      .find({
        dog: dogId,
      })
      .populate('addedBy')
      .sort({ date: -1 })
      .limit(limit)
      .lean();
    return weights;
  }
}
