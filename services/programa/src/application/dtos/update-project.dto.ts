import { PartialType } from '@nestjs/swagger';

import { CreateProjectDto } from './create-project.dto';

/**
 * DTO for updating an existing project
 * All fields are optional (partial)
 */
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
