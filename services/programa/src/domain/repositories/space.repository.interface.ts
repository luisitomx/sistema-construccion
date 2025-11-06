import { Space } from '../entities/space.entity';

/**
 * Space Repository Interface
 * Define los métodos para acceso a datos de espacios
 */
export interface ISpaceRepository {
  /**
   * Find all spaces
   */
  findAll(): Promise<Space[]>;

  /**
   * Find space by ID
   */
  findById(id: string): Promise<Space | null>;

  /**
   * Find spaces by project ID
   */
  findByProject(projectId: string): Promise<Space[]>;

  /**
   * Find spaces by type
   */
  findByType(spaceTypeId: string): Promise<Space[]>;

  /**
   * Create new space
   */
  create(space: Partial<Space>): Promise<Space>;

  /**
   * Update existing space
   */
  update(id: string, space: Partial<Space>): Promise<Space>;

  /**
   * Update real area from DWG
   */
  updateRealArea(id: string, realArea: number): Promise<Space>;

  /**
   * Delete space by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Count spaces by project
   */
  countByProject(projectId: string): Promise<number>;
}
