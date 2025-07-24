import { Module } from '@nestjs/common';
import { DogsModule } from 'src/dogs/dogs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/tasks/task.schema';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { VaccineModule } from 'src/vaccine/vaccine.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    DogsModule,
    VaccineModule,
  ],
  providers: [TasksService, TasksResolver],
  exports: [TasksService],
})
export class TasksModule {}
