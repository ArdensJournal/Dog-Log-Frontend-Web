import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';
import { Dog } from './dog.schema';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { FilesService } from 'src/files/files.service';
import { DogAccessRole } from './enums/access-role.enum';
import { AddDogCollaboratorDto } from './dto/add-dog-collaborator.dto';
import { UsersService } from 'src/users/users.service';
import { RemoveDogCollaboratorDto } from './dto/remove-dog-collaborator.dto';
import { FileUpload } from 'graphql-upload-ts';
@Injectable()
export class DogsService {
  constructor(
    @InjectModel(Dog.name) private dogModel: Model<Dog>,
    private filesService: FilesService,
    private usersService: UsersService,
  ) {}

  async findUserDogs(userId: Types.ObjectId) {
    return this.dogModel
      .find({
        $or: [{ owner: userId }, { 'collaborators.user': userId }],
      })
      .populate({
        path: 'collaborators.user',
        model: 'User',
      });
  }

  async createDog(createDogDto: CreateDogDto, owner: Types.ObjectId) {
    let imageUrl: string | undefined;
    console.log('createDogDto.image', createDogDto.image);
    if (createDogDto.image) {
      const result = await this.uploadDogImage(createDogDto.image, owner);
      if (result) {
        imageUrl = result.url;
      }
    }
    const newDog = new this.dogModel({ ...createDogDto, owner, imageUrl });
    return newDog.save();
  }

  async verifyDogPermission({
    dogId,
    userId,
    requiredRole,
  }: {
    dogId: Types.ObjectId;
    userId: Types.ObjectId;
    requiredRole: DogAccessRole;
  }) {
    const dog = await this.dogModel.findById(dogId).lean();

    if (!dog) {
      throw new NotFoundException('Dog not found');
    }

    // Always allow owner
    if (dog.owner.toString() === userId.toString()) {
      return true;
    }

    const collaborator = dog.collaborators?.find(
      (c) => c.user.toString() === userId.toString(),
    );

    const roleHierarchy = {
      [DogAccessRole.Viewer]: 0,
      [DogAccessRole.Editor]: 1,
    };

    if (
      collaborator &&
      roleHierarchy[collaborator.role] >= roleHierarchy[requiredRole]
    ) {
      return;
    }

    throw new ForbiddenException('You do not have permission for this dog');
  }

  async updateDog(updateDogDto: UpdateDogDto, userId: Types.ObjectId) {
    const { dogId, birthday, breed, name, image } = updateDogDto;
    const updateData: Partial<Dog> = { ...updateDogDto, imageUrl: undefined };
    await this.verifyDogPermission({
      dogId,
      userId,
      requiredRole: DogAccessRole.Editor,
    });
    if (image) {
      const result = await this.uploadDogImage(image, dogId);
      if (result) {
        updateData.imageUrl = result.url;
      }
    }

    return this.dogModel.findByIdAndUpdate(
      dogId,
      {
        ...updateData,
      },
      {
        new: true,
      },
    );
  }

  async addDogCollaborator(
    addDogCollaboratorDto: AddDogCollaboratorDto,
    userId: Types.ObjectId,
  ) {
    await this.verifyDogPermission({
      dogId: addDogCollaboratorDto.dogId,
      userId,
      requiredRole: DogAccessRole.Owner,
    });

    const dog = await this.dogModel.findById(addDogCollaboratorDto.dogId);
    if (!dog) {
      throw new NotFoundException('Dog not found');
    }
    const user = await this.usersService.findUserByEmail(
      addDogCollaboratorDto.email,
    );
    if (dog.owner.toString() === user._id.toString()) {
      throw new BadRequestException(
        'You cannot add yourself as a collaborator',
      );
    }
    const dogLinkedUser = dog.collaborators?.some(
      (c) => c.user.toString() === user._id.toString(),
    );
    if (dogLinkedUser) {
      throw new BadRequestException('User is already a collaborator');
    }

    return this.dogModel.findByIdAndUpdate(addDogCollaboratorDto.dogId, {
      $push: {
        collaborators: {
          user: user._id,
          role: addDogCollaboratorDto.role,
        },
      },
    });
  }

  async removeDogCollaborator(
    removeDogCollaboratorDto: RemoveDogCollaboratorDto,
    userId: Types.ObjectId,
  ) {
    await this.verifyDogPermission({
      dogId: removeDogCollaboratorDto.dogId,
      userId,
      requiredRole: DogAccessRole.Owner,
    });

    return this.dogModel
      .findOneAndUpdate(
        {
          _id: removeDogCollaboratorDto.dogId,
          'collaborators.user': removeDogCollaboratorDto.collaboratorId,
        },
        {
          $pull: {
            collaborators: { user: removeDogCollaboratorDto.collaboratorId },
          },
        },
        { new: true },
      )
      .orFail();
  }

  async getDogsIdsByUserId(userId: Types.ObjectId) {
    return this.dogModel
      .distinct('_id', {
        $or: [{ owner: userId }, { 'collaborators.user': userId }],
      })
      .lean();
  }

  private uploadDogImage(image: FileUpload, dogId: Types.ObjectId) {
    return this.filesService.uploadFile(image, {
      folder: `dogs/${dogId}`,
      publicId: 'dog-profile-image',
    });
  }
}
