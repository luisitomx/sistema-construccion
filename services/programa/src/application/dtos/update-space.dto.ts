import { PartialType, OmitType } from '@nestjs/swagger';

import { CreateSpaceDto } from './create-space.dto';

/**
 * DTO for updating an existing space
 * All fields are optional except projectId (cannot be changed)
 */
export class UpdateSpaceDto extends PartialType(
  OmitType(CreateSpaceDto, ['projectId'] as const),
) {}
