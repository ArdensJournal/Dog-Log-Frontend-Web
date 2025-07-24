import { Module } from '@nestjs/common';
import { VaccineService } from './vaccine.service';
import { VaccineResolver } from './vaccine.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Vaccine, VaccineSchema } from './vaccine.schema';
@Module({
  providers: [VaccineService, VaccineResolver],
  imports: [
    MongooseModule.forFeature([{ name: Vaccine.name, schema: VaccineSchema }]),
  ],
  exports: [VaccineService],
})
export class VaccineModule {}
