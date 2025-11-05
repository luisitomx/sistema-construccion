import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project, Space, SpaceType } from './domain/entities';
import { ProjectRepository, SpaceRepository } from './infrastructure/database/repositories';
import {
  CreateProjectUseCase,
  GetProjectUseCase,
  GetAllProjectsUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
} from './application/use-cases/projects';
import {
  CreateSpaceUseCase,
  GetSpacesByProjectUseCase,
  UpdateSpaceUseCase,
  UpdateSpaceRealAreaUseCase,
  DeleteSpaceUseCase,
} from './application/use-cases/spaces';
import {
  ProjectsController,
  SpacesController,
  SpaceTypesController,
} from './infrastructure/http/controllers';

// Tokens for dependency injection
export const PROJECT_REPOSITORY = 'IProjectRepository';
export const SPACE_REPOSITORY = 'ISpaceRepository';

/**
 * Programa Module
 * Main module for the Programa Arquitectónico microservice
 */
@Module({
  imports: [TypeOrmModule.forFeature([Project, Space, SpaceType])],
  controllers: [ProjectsController, SpacesController, SpaceTypesController],
  providers: [
    // Repositories
    {
      provide: PROJECT_REPOSITORY,
      useClass: ProjectRepository,
    },
    {
      provide: SPACE_REPOSITORY,
      useClass: SpaceRepository,
    },
    ProjectRepository,
    SpaceRepository,

    // Project Use Cases
    CreateProjectUseCase,
    GetProjectUseCase,
    GetAllProjectsUseCase,
    UpdateProjectUseCase,
    DeleteProjectUseCase,

    // Space Use Cases
    CreateSpaceUseCase,
    GetSpacesByProjectUseCase,
    UpdateSpaceUseCase,
    UpdateSpaceRealAreaUseCase,
    DeleteSpaceUseCase,
  ],
  exports: [
    PROJECT_REPOSITORY,
    SPACE_REPOSITORY,
    // Export use cases for potential inter-service communication
    UpdateSpaceRealAreaUseCase,
  ],
})
export class ProgramaModule {}
