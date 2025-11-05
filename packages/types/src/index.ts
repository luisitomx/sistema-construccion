/**
 * Shared Types for Sistema Integral de Gestión de Construcción
 */

/**
 * Project status enumeration
 */
export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Space category enumeration
 */
export enum SpaceCategory {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  INSTITUTIONAL = 'INSTITUTIONAL',
  MIXED = 'MIXED',
}

/**
 * Base entity interface with common fields
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Pagination request interface
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Pagination response interface
 */
export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Project interface
 */
export interface IProject extends BaseEntity {
  name: string;
  description?: string;
  client: string;
  location: string;
  startDate: Date;
  estimatedEndDate?: Date;
  status: ProjectStatus;
}

/**
 * Space interface
 */
export interface ISpace extends BaseEntity {
  projectId: string;
  name: string;
  code?: string;
  spaceTypeId: string;
  requiredArea: number;
  realArea?: number;
  description?: string;
  floor?: number;
  quantity: number;
}

/**
 * SpaceType interface
 */
export interface ISpaceType extends BaseEntity {
  name: string;
  category: SpaceCategory;
  defaultCostPerM2?: number;
  description?: string;
  typicalArea?: number;
}
