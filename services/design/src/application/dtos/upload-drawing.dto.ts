import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class UploadDrawingDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  // file will be provided by multer
  file: Express.Multer.File;
}
