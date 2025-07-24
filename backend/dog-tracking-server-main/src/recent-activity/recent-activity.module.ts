import { Module } from '@nestjs/common';
import { RecentActivityService } from './recent-activity.service';
import { DogsModule } from 'src/dogs/dogs.module';
import { VaccineRecordModule } from 'src/vaccine-record/vaccine-record.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { PottiesModule } from 'src/potties/potties.module';
import { WeightModule } from 'src/weight/weight.module';
import { RecentActivityResolver } from './recent-activity.resolver';
@Module({
  imports: [DogsModule, VaccineRecordModule, TasksModule, PottiesModule, WeightModule],
  providers: [RecentActivityService, RecentActivityResolver],
})
export class RecentActivityModule {}
