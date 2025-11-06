import { Injectable, NotFoundException } from '@nestjs/common';

import { Space } from '@/domain/entities/space.entity';
import { ISpaceRepository } from '@/domain/repositories/space.repository.interface';
import { UpdateSpaceAreaDto } from '@/application/dtos';

/**
 * Use Case: Update Space Real Area from DWG
 * This use case is called from the Design Service after linking DWG polylines
 * It updates the realArea field, completing the connection between design and program
 */
@Injectable()
export class UpdateSpaceRealAreaUseCase {
  constructor(private readonly spaceRepository: ISpaceRepository) {}

  async execute(id: string, dto: UpdateSpaceAreaDto): Promise<Space> {
    const space = await this.spaceRepository.findById(id);

    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }

    return this.spaceRepository.updateRealArea(id, dto.realArea);
  }
}
