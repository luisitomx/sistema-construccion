import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Concept } from '../../../domain/entities/concept.entity';
import { UnitPriceAnalysis } from '../../../domain/entities/unit-price-analysis.entity';
import { CreateConceptDto } from '../../../application/dtos/create-concept.dto';
import { CreateUnitPriceAnalysisDto } from '../../../application/dtos/create-unit-price-analysis.dto';
import { CalculateUnitPriceUseCase } from '../../../application/use-cases/calculate-unit-price.use-case';

@ApiTags('concepts')
@Controller('api/v1/concepts')
export class ConceptsController {
  constructor(
    @InjectRepository(Concept)
    private conceptRepository: Repository<Concept>,
    @InjectRepository(UnitPriceAnalysis)
    private analysisRepository: Repository<UnitPriceAnalysis>,
    private calculateUnitPriceUseCase: CalculateUnitPriceUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create concept' })
  async createConcept(@Body() dto: CreateConceptDto): Promise<Concept> {
    const concept = this.conceptRepository.create(dto);
    return this.conceptRepository.save(concept);
  }

  @Get()
  @ApiOperation({ summary: 'List concepts' })
  async listConcepts(
    @Query('category') category?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 100,
  ): Promise<Concept[]> {
    const where: any = { isActive: true };

    if (category) {
      where.category = category;
    }

    return this.conceptRepository.find({
      where,
      skip,
      take,
      order: { code: 'ASC' },
      relations: ['unitPriceAnalysis'],
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get concept by ID' })
  async getConcept(@Param('id', ParseUUIDPipe) id: string): Promise<Concept> {
    const concept = await this.conceptRepository.findOne({
      where: { id },
      relations: ['unitPriceAnalysis'],
    });

    if (!concept) {
      throw new NotFoundException(`Concept not found: ${id}`);
    }

    return concept;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update concept' })
  async updateConcept(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<CreateConceptDto>,
  ): Promise<Concept> {
    const concept = await this.conceptRepository.findOne({ where: { id } });

    if (!concept) {
      throw new NotFoundException(`Concept not found: ${id}`);
    }

    Object.assign(concept, updateDto);

    return this.conceptRepository.save(concept);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete concept' })
  async deleteConcept(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const result = await this.conceptRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Concept not found: ${id}`);
    }
  }

  @Post(':id/analysis')
  @ApiOperation({ summary: 'Create unit price analysis for concept' })
  async createAnalysis(
    @Param('id', ParseUUIDPipe) conceptId: string,
    @Body() dto: CreateUnitPriceAnalysisDto,
  ): Promise<UnitPriceAnalysis> {
    // Verify concept exists
    const concept = await this.conceptRepository.findOne({ where: { id: conceptId } });

    if (!concept) {
      throw new NotFoundException(`Concept not found: ${conceptId}`);
    }

    dto.conceptId = conceptId;

    const analysis = await this.calculateUnitPriceUseCase.execute(dto);

    // Link analysis to concept
    concept.unitPriceAnalysisId = analysis.id;
    await this.conceptRepository.save(concept);

    return analysis;
  }

  @Get(':id/analysis')
  @ApiOperation({ summary: 'Get unit price analysis for concept' })
  async getAnalysis(@Param('id', ParseUUIDPipe) conceptId: string): Promise<UnitPriceAnalysis | null> {
    const analysis = await this.analysisRepository.findOne({
      where: { conceptId },
    });

    return analysis;
  }
}
