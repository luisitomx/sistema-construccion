import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { DateHelper } from '@construccion/utils';

import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { UpdateProjectDto } from '@/application/dtos';

/**
 * Use Case: Update Project
 * Business rules:
 * - Project must exist
 * - If updating dates, validate start date < estimated end date
 */
@Injectable()
export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Validate dates if provided
    if (dto.startDate || dto.estimatedEndDate) {
      const startDate = dto.startDate
        ? new Date(dto.startDate)
        : project.startDate;
      const estimatedEndDate = dto.estimatedEndDate
        ? new Date(dto.estimatedEndDate)
        : project.estimatedEndDate;

      if (estimatedEndDate && DateHelper.isBefore(estimatedEndDate, startDate)) {
        throw new BadRequestException(
          'Estimated end date must be after start date',
        );
      }
    }

    const updateData: Partial<Project> = {
      ...dto,
      ...(dto.startDate && { startDate: new Date(dto.startDate) }),
      ...(dto.estimatedEndDate && {
        estimatedEndDate: new Date(dto.estimatedEndDate),
      }),
    };

    return this.projectRepository.update(id, updateData);
  }
}
