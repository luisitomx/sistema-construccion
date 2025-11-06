import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

/**
 * Use Case: Delete Project
 * Business rule: Cannot delete project with spaces
 */
@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<void> {
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Business rule: Cannot delete if has spaces
    const hasSpaces = await this.projectRepository.hasSpaces(id);
    if (hasSpaces) {
      throw new BadRequestException(
        'Cannot delete project with associated spaces. Delete spaces first.',
      );
    }

    await this.projectRepository.delete(id);
  }
}
