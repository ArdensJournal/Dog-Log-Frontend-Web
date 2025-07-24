import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Potty } from 'src/potties/potty.schema';
import { CreatePottyDto } from './dto/create-potty.dto';
import { DogsService } from 'src/dogs/dogs.service';
import { PottyModel } from './potty.model';
import { FindByDogIdDto } from 'src/shared/dto/find-by-dog-id.dto';
import { DogAccessRole } from 'src/dogs/enums/access-role.enum';
@Injectable()
export class PottiesService {
  constructor(
    @InjectModel(Potty.name) private pottyModel: Model<Potty>,
    private readonly dogsService: DogsService,
  ) {}
  async createPotty(createPottyDto: CreatePottyDto, userId: Types.ObjectId) {
    await this.dogsService.verifyDogPermission({
      dogId: createPottyDto.dog,
      userId,
      requiredRole: DogAccessRole.Editor,
    });
    const potty = new this.pottyModel({
      ...createPottyDto,
      addedBy: userId,
    });
    return potty.save();
  }

  async findPottyByDogId(
    findByDogIdDto: FindByDogIdDto,
    userId: Types.ObjectId,
  ) {
    await this.dogsService.verifyDogPermission({
      dogId: findByDogIdDto.dogId,
      userId,
      requiredRole: DogAccessRole.Viewer,
    });
    return this.pottyModel.find({ dog: findByDogIdDto.dogId });
  }

  async findLastPottyByDogId({
    dogId,
    limit = 3,
  }: {
    dogId: Types.ObjectId;
    limit: number;
  }) {
    return this.pottyModel
      .find({ dog: dogId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('addedBy')
      .populate('dog');
  }
}
