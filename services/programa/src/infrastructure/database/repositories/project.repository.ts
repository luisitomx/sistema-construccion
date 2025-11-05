import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectStatus } from '@construccion/types';

import { Project } from '@/domain/entities/project.entity';
import { IProjectRepository } from '@/domain/repositories/project.repository.interface';

/**
 * Project Repository Implementation using TypeORM
 */
@Injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<Project[]> {
    const skip = (page - 1) * limit;
    return this.repository.find({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['spaces'],
    });
  }

  async findById(id: string): Promise<Project | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['spaces', 'spaces.spaceType'],
    });
  }

  async findByStatus(status: ProjectStatus): Promise<Project[]> {
    return this.repository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async create(project: Partial<Project>): Promise<Project> {
    const newProject = this.repository.create(project);
    return this.repository.save(newProject);
  }

  async update(id: string, project: Partial<Project>): Promise<Project> {
    await this.repository.update(id, project);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Project with ID ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async hasSpaces(id: string): Promise<boolean> {
    const project = await this.repository.findOne({
      where: { id },
      relations: ['spaces'],
    });
    return project ? project.spaces.length > 0 : false;
  }
}
