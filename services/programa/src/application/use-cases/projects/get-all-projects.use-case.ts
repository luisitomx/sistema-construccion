import { Injectable } from '@nestjs/common';

import { PaginationResponse } from '@construccion/types';

import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

/**
 * Use Case: Get All Projects with Pagination
 */
@Injectable()
export class GetAllProjectsUseCase {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResponse<Project>> {
    const projects = await this.projectRepository.findAll(page, limit);
    const total = await this.projectRepository.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: projects,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
