import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { TaskModel } from 'src/tasks/task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { Types } from 'mongoose';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { GetUserTasksDto } from './dto/get-user-tasks.dto';
@Resolver()
@UseGuards(GqlAuthGuard)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => TaskModel)
  createTask(
    @Args('createTaskDto') createTaskDto: CreateTaskDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Query(() => [TaskModel])
  getUserTasks(
    @Args('getUserTasksDto') getUserTasksDto: GetUserTasksDto,
    @CurrentUserId() userId: Types.ObjectId,
  ) {
    return this.tasksService.getUserTasks(getUserTasksDto, userId);
  }
}
