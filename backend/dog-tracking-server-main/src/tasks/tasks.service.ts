import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DogsService } from 'src/dogs/dogs.service';
import { Task } from 'src/tasks/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { DogAccessRole } from 'src/dogs/enums/access-role.enum';
import { GetUserTasksDto } from './dto/get-user-tasks.dto';
@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<Task>,
    private readonly dogsService: DogsService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, userId: Types.ObjectId) {
    await this.dogsService.verifyDogPermission({
      dogId: createTaskDto.dog,
      userId,
      requiredRole: DogAccessRole.Editor,
    });
    const task = new this.taskModel({
      ...createTaskDto,
      addedBy: userId,
    });
    return task.save();
  }

  async getUserTasks(getUserTasksDto: GetUserTasksDto, userId: Types.ObjectId) {
    const { dogId } = getUserTasksDto;
    if (dogId) {
      await this.dogsService.verifyDogPermission({
        dogId,
        userId,
        requiredRole: DogAccessRole.Viewer,
      });
      return this.taskModel
        .find({ dog: dogId })
        .populate('vaccine')
        .populate('dog');
    }
    const dogsIds = (await this.dogsService.getDogsIdsByUserId(userId)).map(
      (id: Types.ObjectId) => id.toString(),
    );
    return this.taskModel
      .find({ dog: { $in: dogsIds } })
      .populate('vaccine')
      .populate('dog')
      .lean();
  }

  async findLastTasksByDogId({
    dogId,
    limit = 3,
  }: {
    dogId: Types.ObjectId;
    limit: number;
  }) {
    return this.taskModel
      .find({ dog: dogId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('addedBy')
      .lean();
  }
}
