import { Field, ObjectType } from '@nestjs/graphql';
import { PottyModel } from 'src/potties/potty.model';
import { WeightModel } from 'src/weight/weight.model';
import { RecentActivityType } from 'src/recent-activity/enums/recent-activity-type';
import { TaskModel } from 'src/tasks/task.model';
import { VaccineRecordModel } from 'src/vaccine-record/vaccine-record.model';
@ObjectType()
export class RecentActivityResponseDto {
  @Field(() => RecentActivityType)
  type: RecentActivityType;

  @Field(() => TaskModel, { nullable: true })
  task?: TaskModel;

  @Field(() => VaccineRecordModel, { nullable: true })
  vaccineRecord?: VaccineRecordModel;

  @Field(() => PottyModel, { nullable: true })
  potty?: PottyModel;

  @Field(() => WeightModel, { nullable: true })
  weight?: WeightModel;
}
