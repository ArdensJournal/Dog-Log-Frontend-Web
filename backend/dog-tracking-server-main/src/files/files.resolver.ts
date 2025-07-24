import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload } from 'graphql-upload-ts';
import { CreateFileDto } from './dto/create-file.dto';
import { FilesService } from './files.service';

@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => String)
  async uploadFile(@Args('body') body: CreateFileDto) {
    const result = await this.filesService.uploadFile(body.image, {
      folder: 'test',
      publicId: "body.publicId",
    });
    return result?.url;
  }
}
