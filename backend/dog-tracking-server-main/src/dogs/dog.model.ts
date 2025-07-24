import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { DogBreed } from './enums/breed';
import { Gender } from './enums/gender';
import { Types } from 'mongoose';
import { DogCollaboratorRole } from './enums/access-role.enum';
import { CollaboratorRoleModel } from './collaborator-role.model';
@ObjectType()
export class DogModel {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field({ description: 'The name of the dog' })
  name: string;

  @Field(() => [DogBreed], {
    nullable: true,
    description: 'The breed of the dog',
  })
  breed: DogBreed[];

  @Field(() => Date, {
    nullable: true,
    description: 'The birthday of the dog',
  })
  birthday?: Date;

  @Field(() => Gender, {
    nullable: true,
    description: 'The gender of the dog',
  })
  gender?: Gender;

  @Field(() => String, {
    nullable: true,
    description: 'The image url of the dog',
  })
  imageUrl?: string;

  @Field(() => [CollaboratorRoleModel], {
    nullable: true,
    description: 'The collaborators of the dog',
  })
  collaborators?: CollaboratorRoleModel[];
}
registerEnumType(DogBreed, {
  name: 'DogBreed',
});
registerEnumType(Gender, {
  name: 'Gender',
});
registerEnumType(DogCollaboratorRole, {
  name: 'DogCollaboratorRole',
});
