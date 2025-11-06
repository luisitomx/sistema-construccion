import { RefreshToken } from '../entities/refresh-token.entity';

/**
 * RefreshToken Repository Interface
 */
export interface IRefreshTokenRepository {
  /**
   * Find token by token string
   */
  findByToken(token: string): Promise<RefreshToken | null>;

  /**
   * Create refresh token
   */
  create(token: Partial<RefreshToken>): Promise<RefreshToken>;

  /**
   * Revoke token
   */
  revoke(tokenId: string): Promise<void>;

  /**
   * Revoke all tokens for user
   */
  revokeAllForUser(userId: string): Promise<void>;

  /**
   * Delete expired tokens
   */
  deleteExpired(): Promise<void>;
}
