import { Module } from '@nestjs/common';
import { WeightService } from './weight.service';
import { WeightSchema } from 'src/weight/weight.schema';
import { Weight } from 'src/weight/weight.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DogsModule } from 'src/dogs/dogs.module';
import { WeightResolver } from './weight.resolver';

@Module({
  providers: [WeightService, WeightResolver],
  imports: [
    MongooseModule.forFeature([{ name: Weight.name, schema: WeightSchema }]),
    DogsModule,
  ],
  exports: [WeightService],
})
export class WeightModule {}
