import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { DogCollaboratorRole } from './enums/access-role.enum';
import { UserModel } from 'src/users/user.model';

@ObjectType({
  description: 'The role of the collaborator in the dog',
})
export class CollaboratorRoleModel {
  @Field(() => UserModel)
  user: Types.ObjectId;

  @Field(() => DogCollaboratorRole)
  role: DogCollaboratorRole;
}
