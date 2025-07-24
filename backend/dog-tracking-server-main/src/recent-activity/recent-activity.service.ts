import { Injectable } from '@nestjs/common';
import { DogsService } from 'src/dogs/dogs.service';
import { VaccineRecordService } from 'src/vaccine-record/vaccine-record.service';
import { TasksService } from 'src/tasks/tasks.service';
import { UsersService } from 'src/users/users.service';
import { PottiesService } from 'src/potties/potties.service';
import { RecentActivityResponseDto } from 'src/recent-activity/dto/recent-activity-response.dto';
import { RecentActivityType } from 'src/recent-activity/enums/recent-activity-type';
import { WeightService } from 'src/weight/weight.service';
import { FindByDogIdDto } from 'src/shared/dto/find-by-dog-id.dto';
import { Types } from 'mongoose';
import { DogAccessRole } from 'src/dogs/enums/access-role.enum';
@Injectable()
export class RecentActivityService {
  constructor(
    private readonly dogsService: DogsService,
    private readonly vaccineRecordService: VaccineRecordService,
    private readonly tasksService: TasksService,
    private readonly pottiesService: PottiesService,
    private readonly weightService: WeightService,
  ) {}

  async getRecentActivityByDog(
    findByDogIdDto: FindByDogIdDto,
    userId: Types.ObjectId,
  ) {
    const { dogId } = findByDogIdDto;
    await this.dogsService.verifyDogPermission    ({
      dogId,
      userId,
      requiredRole: DogAccessRole.Viewer,
    });
    const limit = 3;
    const [vaccineRecord, tasks, potties, weights] = await Promise.all([
      this.vaccineRecordService.findLastVaccineRecordByDog({
        dogId,
        limit,
      }),
      this.tasksService.findLastTasksByDogId({
        dogId,
        limit,
      }),
      this.pottiesService.findLastPottyByDogId({
        dogId,
        limit,
      }),
      this.weightService.findLastWeightByDog({
        dogId,
        limit,
      }),
    ]);
    const allActivities = [
      ...vaccineRecord.map((v) => ({
        type: RecentActivityType.VACCINE_RECORD,
        vaccineRecord: v,
        createdAt: v.createdAt,
      })),
      ...tasks.map((t) => ({
        type: RecentActivityType.TASK_RECORDS,
        task: t,
        createdAt: t.createdAt,
      })),
      ...potties.map((p) => ({
        type: RecentActivityType.POTTY_RECORD,
        potty: p,
        createdAt: p.createdAt,
      })),
      ...weights.map((w) => ({
        type: RecentActivityType.WEIGHT_RECORD,
        weight: w,
        createdAt: w.createdAt,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return allActivities;
  }
}
