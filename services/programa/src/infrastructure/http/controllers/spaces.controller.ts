import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { Space } from '@/domain/entities/space.entity';
import {
  CreateSpaceUseCase,
  UpdateSpaceUseCase,
  UpdateSpaceRealAreaUseCase,
  DeleteSpaceUseCase,
} from '@/application/use-cases/spaces';
import {
  CreateSpaceDto,
  UpdateSpaceDto,
  UpdateSpaceAreaDto,
} from '@/application/dtos';
import { ISpaceRepository } from '@/domain/repositories/space.repository.interface';

/**
 * Spaces Controller
 * Handles HTTP requests for space management
 */
@ApiTags('Spaces')
@Controller('spaces')
export class SpacesController {
  constructor(
    private readonly spaceRepository: ISpaceRepository,
    private readonly createSpaceUseCase: CreateSpaceUseCase,
    private readonly updateSpaceUseCase: UpdateSpaceUseCase,
    private readonly updateSpaceRealAreaUseCase: UpdateSpaceRealAreaUseCase,
    private readonly deleteSpaceUseCase: DeleteSpaceUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new space (generates Espacio_ID)' })
  @ApiResponse({
    status: 201,
    description: 'Space created successfully with Espacio_ID',
    type: Space,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Project or SpaceType not found' })
  async create(@Body() dto: CreateSpaceDto): Promise<Space> {
    return this.createSpaceUseCase.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get space by ID (Espacio_ID)' })
  @ApiParam({ name: 'id', description: 'Space UUID (Espacio_ID)' })
  @ApiResponse({ status: 200, description: 'Space found', type: Space })
  @ApiResponse({ status: 404, description: 'Space not found' })
  async findOne(@Param('id') id: string): Promise<Space | null> {
    return this.spaceRepository.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update space' })
  @ApiParam({ name: 'id', description: 'Space UUID (Espacio_ID)' })
  @ApiResponse({
    status: 200,
    description: 'Space updated successfully',
    type: Space,
  })
  @ApiResponse({ status: 404, description: 'Space not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSpaceDto,
  ): Promise<Space> {
    return this.updateSpaceUseCase.execute(id, dto);
  }

  @Patch(':id/area')
  @ApiOperation({
    summary: 'Update real area from DWG (called by Design Service)',
  })
  @ApiParam({ name: 'id', description: 'Space UUID (Espacio_ID)' })
  @ApiResponse({
    status: 200,
    description: 'Real area updated successfully',
    type: Space,
  })
  @ApiResponse({ status: 404, description: 'Space not found' })
  async updateArea(
    @Param('id') id: string,
    @Body() dto: UpdateSpaceAreaDto,
  ): Promise<Space> {
    return this.updateSpaceRealAreaUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete space' })
  @ApiParam({ name: 'id', description: 'Space UUID (Espacio_ID)' })
  @ApiResponse({ status: 204, description: 'Space deleted successfully' })
  @ApiResponse({ status: 404, description: 'Space not found' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.deleteSpaceUseCase.execute(id);
  }
}
