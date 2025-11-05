import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Material } from '../../../domain/entities/material.entity';
import { Labor } from '../../../domain/entities/labor.entity';
import { Equipment } from '../../../domain/entities/equipment.entity';

@ApiTags('materials')
@Controller('api/v1/materials')
export class MaterialsController {
  constructor(
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create material' })
  async create(@Body() dto: Partial<Material>): Promise<Material> {
    const material = this.materialRepository.create(dto);
    return this.materialRepository.save(material);
  }

  @Get()
  @ApiOperation({ summary: 'List materials' })
  async list(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
  ): Promise<Material[]> {
    return this.materialRepository.find({
      where: { isActive: true },
      skip,
      take,
      order: { code: 'ASC' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material by ID' })
  async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Material> {
    const material = await this.materialRepository.findOne({ where: { id } });

    if (!material) {
      throw new NotFoundException(`Material not found: ${id}`);
    }

    return material;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update material' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<Material>,
  ): Promise<Material> {
    const material = await this.materialRepository.findOne({ where: { id } });

    if (!material) {
      throw new NotFoundException(`Material not found: ${id}`);
    }

    Object.assign(material, updateDto);

    return this.materialRepository.save(material);
  }
}

@ApiTags('labor')
@Controller('api/v1/labor')
export class LaborController {
  constructor(
    @InjectRepository(Labor)
    private laborRepository: Repository<Labor>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create labor category' })
  async create(@Body() dto: Partial<Labor>): Promise<Labor> {
    const labor = this.laborRepository.create(dto);
    return this.laborRepository.save(labor);
  }

  @Get()
  @ApiOperation({ summary: 'List labor categories' })
  async list(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
  ): Promise<Labor[]> {
    return this.laborRepository.find({
      where: { isActive: true },
      skip,
      take,
      order: { code: 'ASC' },
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update labor category' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<Labor>,
  ): Promise<Labor> {
    const labor = await this.laborRepository.findOne({ where: { id } });

    if (!labor) {
      throw new NotFoundException(`Labor not found: ${id}`);
    }

    Object.assign(labor, updateDto);

    return this.laborRepository.save(labor);
  }
}

@ApiTags('equipment')
@Controller('api/v1/equipment')
export class EquipmentController {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create equipment' })
  async create(@Body() dto: Partial<Equipment>): Promise<Equipment> {
    const equipment = this.equipmentRepository.create(dto);
    return this.equipmentRepository.save(equipment);
  }

  @Get()
  @ApiOperation({ summary: 'List equipment' })
  async list(
    @Query('skip') skip = 0,
    @Query('take') take = 100,
  ): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { isActive: true },
      skip,
      take,
      order: { code: 'ASC' },
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update equipment' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<Equipment>,
  ): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({ where: { id } });

    if (!equipment) {
      throw new NotFoundException(`Equipment not found: ${id}`);
    }

    Object.assign(equipment, updateDto);

    return this.equipmentRepository.save(equipment);
  }
}
