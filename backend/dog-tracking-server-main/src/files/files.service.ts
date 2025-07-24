import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class FilesService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadFile(
    filePromise: Promise<FileUpload> | FileUpload,
    options: { folder: string; publicId: string },
  ) {
    const { createReadStream, filename, mimetype } = await filePromise;

    const stream = createReadStream();
    const result: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: options.folder,
            public_id: options.publicId,
            transformation: { width: 100, height: 100, crop: 'fill' },
            quality: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.pipe(uploadStream);
      },
    );
    return result;
  }
}
