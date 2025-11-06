import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { PaginationResponse } from '@construccion/types';

import { Project } from '@/domain/entities/project.entity';
import {
  CreateProjectUseCase,
  GetProjectUseCase,
  GetAllProjectsUseCase,
  UpdateProjectUseCase,
  DeleteProjectUseCase,
} from '@/application/use-cases/projects';
import { CreateProjectDto, UpdateProjectDto } from '@/application/dtos';
import { GetSpacesByProjectUseCase } from '@/application/use-cases/spaces';

/**
 * Projects Controller
 * Handles HTTP requests for project management
 */
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
    private readonly getAllProjectsUseCase: GetAllProjectsUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly getSpacesByProjectUseCase: GetSpacesByProjectUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    type: Project,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() dto: CreateProjectDto): Promise<Project> {
    return this.createProjectUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Projects retrieved successfully',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PaginationResponse<Project>> {
    return this.getAllProjectsUseCase.execute(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Project found', type: Project })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string): Promise<Project> {
    return this.getProjectUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({
    status: 200,
    description: 'Project updated successfully',
    type: Project,
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.updateProjectUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete project with spaces',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteProjectUseCase.execute(id);
  }

  @Get(':id/spaces')
  @ApiOperation({ summary: 'Get all spaces for a project' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiResponse({ status: 200, description: 'Spaces retrieved successfully' })
  async getSpaces(@Param('id') id: string) {
    return this.getSpacesByProjectUseCase.execute(id);
  }
}
