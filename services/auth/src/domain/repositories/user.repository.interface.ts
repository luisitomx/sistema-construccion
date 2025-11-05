import { User } from '../entities/user.entity';

/**
 * User Repository Interface
 */
export interface IUserRepository {
  /**
   * Find user by email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Create new user
   */
  create(user: Partial<User>): Promise<User>;

  /**
   * Update user
   */
  update(id: string, user: Partial<User>): Promise<User>;

  /**
   * Delete user
   */
  delete(id: string): Promise<void>;

  /**
   * Update last login timestamp
   */
  updateLastLogin(id: string): Promise<void>;

  /**
   * Check if email exists
   */
  emailExists(email: string): Promise<boolean>;
}
