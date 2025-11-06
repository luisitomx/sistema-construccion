import { Role, RoleType } from '../entities/role.entity';

/**
 * Role Repository Interface
 */
export interface IRoleRepository {
  /**
   * Find role by name
   */
  findByName(name: RoleType): Promise<Role | null>;

  /**
   * Find role by ID with permissions
   */
  findByIdWithPermissions(id: string): Promise<Role | null>;

  /**
   * Find all roles
   */
  findAll(): Promise<Role[]>;

  /**
   * Create role
   */
  create(role: Partial<Role>): Promise<Role>;
}
