import { Injectable, NotFoundException } from '@nestjs/common';

import { ISpaceRepository } from '@/domain/repositories/space.repository.interface';

/**
 * Use Case: Delete Space
 */
@Injectable()
export class DeleteSpaceUseCase {
  constructor(private readonly spaceRepository: ISpaceRepository) {}

  async execute(id: string): Promise<void> {
    const space = await this.spaceRepository.findById(id);

    if (!space) {
      throw new NotFoundException(`Space with ID ${id} not found`);
    }

    await this.spaceRepository.delete(id);
  }
}
