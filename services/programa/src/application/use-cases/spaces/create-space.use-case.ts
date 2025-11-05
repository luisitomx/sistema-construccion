import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Space } from '@/domain/entities/space.entity';
import { Project } from '@/domain/entities/project.entity';
import { SpaceType } from '@/domain/entities/space-type.entity';
import { ISpaceRepository } from '@/domain/repositories/space.repository.interface';
import { CreateSpaceDto } from '@/application/dtos';

/**
 * Use Case: Create Space
 * Business rules:
 * - Project must exist
 * - SpaceType must exist
 * - Creates the Espacio_ID (UUID) that connects the entire system
 */
@Injectable()
export class CreateSpaceUseCase {
  constructor(
    private readonly spaceRepository: ISpaceRepository,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(SpaceType)
    private readonly spaceTypeRepository: Repository<SpaceType>,
  ) {}

  async execute(dto: CreateSpaceDto): Promise<Space> {
    // Validate project exists
    const project = await this.projectRepository.findOne({
      where: { id: dto.projectId },
    });
    if (!project) {
      throw new NotFoundException(
        `Project with ID ${dto.projectId} not found`,
      );
    }

    // Validate space type exists
    const spaceType = await this.spaceTypeRepository.findOne({
      where: { id: dto.spaceTypeId },
    });
    if (!spaceType) {
      throw new NotFoundException(
        `Space type with ID ${dto.spaceTypeId} not found`,
      );
    }

    // Create space with Espacio_ID
    const space = await this.spaceRepository.create({
      projectId: dto.projectId,
      name: dto.name,
      code: dto.code,
      spaceTypeId: dto.spaceTypeId,
      requiredArea: dto.requiredArea,
      description: dto.description,
      floor: dto.floor,
      quantity: dto.quantity || 1,
    });

    return space;
  }
}
