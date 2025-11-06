import { Injectable } from '@nestjs/common';

import { Space } from '@/domain/entities/space.entity';
import { ISpaceRepository } from '@/domain/repositories/space.repository.interface';

/**
 * Use Case: Get Spaces by Project
 */
@Injectable()
export class GetSpacesByProjectUseCase {
  constructor(private readonly spaceRepository: ISpaceRepository) {}

  async execute(projectId: string): Promise<Space[]> {
    return this.spaceRepository.findByProject(projectId);
  }
}
