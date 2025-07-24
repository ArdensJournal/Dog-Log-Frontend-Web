import { Module } from '@nestjs/common';
import { DogsService } from './dogs.service';
import { DogsResolver } from './dogs.resolver';
import { Dog, DogSchema } from './dog.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  providers: [DogsService, DogsResolver],
  imports: [
    MongooseModule.forFeature([{ name: Dog.name, schema: DogSchema }]),
    FilesModule,
    UsersModule,
  ],
  exports: [DogsService],
})
export class DogsModule {}
