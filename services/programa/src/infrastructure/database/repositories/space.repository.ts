import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Space } from '@/domain/entities/space.entity';
import { ISpaceRepository } from '@/domain/repositories/space.repository.interface';

/**
 * Space Repository Implementation using TypeORM
 */
@Injectable()
export class SpaceRepository implements ISpaceRepository {
  constructor(
    @InjectRepository(Space)
    private readonly repository: Repository<Space>,
  ) {}

  async findAll(): Promise<Space[]> {
    return this.repository.find({
      relations: ['project', 'spaceType'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Space | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['project', 'spaceType'],
    });
  }

  async findByProject(projectId: string): Promise<Space[]> {
    return this.repository.find({
      where: { projectId },
      relations: ['spaceType'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByType(spaceTypeId: string): Promise<Space[]> {
    return this.repository.find({
      where: { spaceTypeId },
      relations: ['project'],
    });
  }

  async create(space: Partial<Space>): Promise<Space> {
    const newSpace = this.repository.create(space);
    return this.repository.save(newSpace);
  }

  async update(id: string, space: Partial<Space>): Promise<Space> {
    await this.repository.update(id, space);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Space with ID ${id} not found after update`);
    }
    return updated;
  }

  async updateRealArea(id: string, realArea: number): Promise<Space> {
    await this.repository.update(id, { realArea });
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Space with ID ${id} not found after update`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async countByProject(projectId: string): Promise<number> {
    return this.repository.count({ where: { projectId } });
  }
}
