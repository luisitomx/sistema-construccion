import { Injectable, BadRequestException } from '@nestjs/common';

import { DateHelper } from '@construccion/utils';

import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';
import { CreateProjectDto } from '@/application/dtos';

/**
 * Use Case: Create Project
 * Business rules:
 * - Start date cannot be in the past
 * - Estimated end date must be after start date
 */
@Injectable()
export class CreateProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(dto: CreateProjectDto): Promise<Project> {
    const startDate = new Date(dto.startDate);
    const estimatedEndDate = dto.estimatedEndDate
      ? new Date(dto.estimatedEndDate)
      : undefined;

    // Business rule: Start date cannot be in the past
    if (DateHelper.isPast(startDate)) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    // Business rule: Estimated end date must be after start date
    if (estimatedEndDate && DateHelper.isBefore(estimatedEndDate, startDate)) {
      throw new BadRequestException(
        'Estimated end date must be after start date',
      );
    }

    const project = await this.projectRepository.create({
      name: dto.name,
      description: dto.description,
      client: dto.client,
      location: dto.location,
      startDate,
      estimatedEndDate,
      status: dto.status,
    });

    return project;
  }
}
