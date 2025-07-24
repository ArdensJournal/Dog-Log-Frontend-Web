import { Module } from '@nestjs/common';
import { VaccineRecordService } from './vaccine-record.service';
import { VaccineRecordResolver } from './vaccine-record.resolver';
import { VaccineRecordSchema } from 'src/vaccine-record/vaccine-record.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { VaccineRecord } from 'src/vaccine-record/vaccine-record.schema';
import { DogsModule } from 'src/dogs/dogs.module';
import { TasksModule } from 'src/tasks/tasks.module';
@Module({
  providers: [VaccineRecordService, VaccineRecordResolver],
  imports: [
    MongooseModule.forFeature([
      { name: VaccineRecord.name, schema: VaccineRecordSchema },
    ]),
    DogsModule,
    TasksModule,
  ],
  exports: [VaccineRecordService],
})
export class VaccineRecordModule {}
