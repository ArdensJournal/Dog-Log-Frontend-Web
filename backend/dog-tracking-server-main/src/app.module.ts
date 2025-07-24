import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DogsModule } from './dogs/dogs.module';
import { PottiesModule } from './potties/potties.module';
import { VaccineModule } from './vaccine/vaccine.module';
import { VaccineRecordModule } from './vaccine-record/vaccine-record.module';
import { TasksModule } from './tasks/tasks.module';
import { FilesModule } from './files/files.module';
import { RecentActivityModule } from './recent-activity/recent-activity.module';
import { WeightModule } from './weight/weight.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      sortSchema: true,
    }),

    AuthModule,
    UsersModule,
    DogsModule,
    PottiesModule,
    VaccineModule,
    VaccineRecordModule,
    TasksModule,
    FilesModule,
    RecentActivityModule,
    WeightModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
