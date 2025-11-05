import { Drawing } from '../entities/drawing.entity';

export interface IDrawingRepository {
  create(drawing: Partial<Drawing>): Promise<Drawing>;
  findById(id: string): Promise<Drawing | null>;
  findByProjectId(projectId: string): Promise<Drawing[]>;
  findAll(skip?: number, take?: number): Promise<Drawing[]>;
  update(id: string, data: Partial<Drawing>): Promise<Drawing>;
  delete(id: string): Promise<void>;
}
