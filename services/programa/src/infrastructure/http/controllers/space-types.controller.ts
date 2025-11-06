import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SpaceType } from '@/domain/entities/space-type.entity';

/**
 * SpaceTypes Controller
 * Handles HTTP requests for space type management
 */
@ApiTags('Space Types')
@Controller('space-types')
export class SpaceTypesController {
  constructor(
    @InjectRepository(SpaceType)
    private readonly spaceTypeRepository: Repository<SpaceType>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all space types' })
  @ApiResponse({
    status: 200,
    description: 'Space types retrieved successfully',
    type: [SpaceType],
  })
  async findAll(): Promise<SpaceType[]> {
    return this.spaceTypeRepository.find({
      order: { category: 'ASC', name: 'ASC' },
    });
  }
}
