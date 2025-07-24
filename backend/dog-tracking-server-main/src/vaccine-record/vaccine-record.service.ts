import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VaccineRecord } from 'src/vaccine-record/vaccine-record.schema';
import { CreateVaccineRecordDto } from './dto/create-vaccine-record.dto';
import { DogsService } from 'src/dogs/dogs.service';
import { TasksService } from 'src/tasks/tasks.service';
import { FindByDogIdDto } from 'src/shared/dto/find-by-dog-id.dto';
import { DogAccessRole } from 'src/dogs/enums/access-role.enum';
@Injectable()
export class VaccineRecordService {
  constructor(
    @InjectModel(VaccineRecord.name)
    private vaccineRecordModel: Model<VaccineRecord>,
    private readonly dogsService: DogsService,
    private readonly tasksService: TasksService,
  ) {}

  async findAllVaccineRecordsByDog(
    findByDogIdDto: FindByDogIdDto,
    userId: Types.ObjectId,
  ) {
    await this.dogsService.verifyDogPermission({
      dogId: findByDogIdDto.dogId,
      userId,
      requiredRole: DogAccessRole.Viewer,
    });
    return this.vaccineRecordModel
      .find({
        dog: findByDogIdDto.dogId,
      })
      .populate('vaccine');
  }

  async createVaccineRecord(
    createVaccineRecordDto: CreateVaccineRecordDto,
    userId: Types.ObjectId,
  ) {
    await this.dogsService.verifyDogPermission({
      dogId: createVaccineRecordDto.dog,
      userId,
      requiredRole: DogAccessRole.Editor, 
    });
    const vaccineRecord = await new this.vaccineRecordModel({
      ...createVaccineRecordDto,
      addedBy: userId,
    }).populate('vaccine');
    await vaccineRecord.save();
    if (createVaccineRecordDto.nextVaccinationDate) {
      this.tasksService.createTask(
        {
          name: vaccineRecord.vaccine.name,
          date: createVaccineRecordDto.nextVaccinationDate,
          dog: createVaccineRecordDto.dog,
          isCompleted: false,
          vaccine: createVaccineRecordDto.vaccine,
        },
        userId,
      );
    }
    return vaccineRecord;
  }

  async findLastVaccineRecordByDog({
    dogId,
    limit = 3,
  }: {
    dogId: Types.ObjectId;
    limit: number;
  }) {
    const vaccineRecords = await this.vaccineRecordModel
      .find({
        dog: dogId,
      })
      .populate('vaccine')
      .populate('addedBy')
      .sort({ date: -1 })
      .limit(limit)
      .lean();
    return vaccineRecords;
  }
}
