import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class LinkSpaceDto {
  @IsUUID()
  @IsNotEmpty()
  spaceId: string;

  @IsUUID()
  @IsNotEmpty()
  polylineId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
