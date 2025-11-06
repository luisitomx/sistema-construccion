import { ProjectStatus } from '@construccion/types';

import { Project } from '../entities/project.entity';

/**
 * Project Repository Interface
 * Define los métodos para acceso a datos de proyectos
 */
export interface IProjectRepository {
  /**
   * Find all projects with optional pagination
   */
  findAll(page?: number, limit?: number): Promise<Project[]>;

  /**
   * Find project by ID
   */
  findById(id: string): Promise<Project | null>;

  /**
   * Find projects by status
   */
  findByStatus(status: ProjectStatus): Promise<Project[]>;

  /**
   * Create new project
   */
  create(project: Partial<Project>): Promise<Project>;

  /**
   * Update existing project
   */
  update(id: string, project: Partial<Project>): Promise<Project>;

  /**
   * Delete project by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Count total projects
   */
  count(): Promise<number>;

  /**
   * Check if project has spaces
   */
  hasSpaces(id: string): Promise<boolean>;
}
