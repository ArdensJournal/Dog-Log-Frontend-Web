import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PottySchema } from 'src/potties/potty.schema';
import { Potty } from 'src/potties/potty.schema';
import { PottiesService } from './potties.service';
import { PottiesResolver } from './potties.resolver';
import { DogsModule } from 'src/dogs/dogs.module';
@Module({
  providers: [PottiesService, PottiesResolver],
  imports: [
    MongooseModule.forFeature([{ name: Potty.name, schema: PottySchema }]),
    DogsModule,
  ],
  exports: [PottiesService],
})
export class PottiesModule {}
