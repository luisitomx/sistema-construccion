import { Injectable, NotFoundException } from '@nestjs/common';

import { Space } from '@/domain/entities/space.entity';
import { ISpaceRepository } from '@/domain/repositories/space.repository.interface';
import { UpdateSpaceDto } from '@/application/dtos';

/**
 * Use Case: Update Space
 */
@Injectable()
export class UpdateSpaceUseCase {
  constructor(private readonly spaceRepository: ISpaceRepository) {}

  async execute(id: string, dto: UpdateSpaceDto): Promise<Space> {
    const space = await this.spaceRepository.findById(id);

    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }

    return this.spaceRepository.update(id, dto);
  }
}
