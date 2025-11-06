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
import { Budget, BudgetStatus } from '../../../domain/entities/budget.entity';
import { BudgetItem } from '../../../domain/entities/budget-item.entity';
import { Concept } from '../../../domain/entities/concept.entity';
import { CreateBudgetDto } from '../../../application/dtos/create-budget.dto';
import { CreateBudgetItemDto } from '../../../application/dtos/create-budget-item.dto';
import { CalculateBudgetUseCase } from '../../../application/use-cases/calculate-budget.use-case';
import { ExplodeMaterialsUseCase } from '../../../application/use-cases/explode-materials.use-case';

@ApiTags('budgets')
@Controller('api/v1/budgets')
export class BudgetsController {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetItem)
    private itemRepository: Repository<BudgetItem>,
    @InjectRepository(Concept)
    private conceptRepository: Repository<Concept>,
    private calculateBudgetUseCase: CalculateBudgetUseCase,
    private explodeMaterialsUseCase: ExplodeMaterialsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create budget' })
  async createBudget(@Body() dto: CreateBudgetDto): Promise<Budget> {
    const budget = this.budgetRepository.create({
      projectId: dto.projectId,
      name: dto.name,
      description: dto.description,
      status: BudgetStatus.DRAFT,
      createdBy: dto.userId,
      version: 1,
    });

    return this.budgetRepository.save(budget);
  }

  @Get()
  @ApiOperation({ summary: 'List budgets' })
  async listBudgets(
    @Query('projectId') projectId?: string,
    @Query('status') status?: BudgetStatus,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ): Promise<Budget[]> {
    const where: any = {};

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status;
    }

    return this.budgetRepository.find({
      where,
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get budget by ID' })
  async getBudget(@Param('id', ParseUUIDPipe) id: string): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id },
      relations: ['items', 'items.concept', 'items.concept.unitPriceAnalysis'],
    });

    if (!budget) {
      throw new NotFoundException(`Budget not found: ${id}`);
    }

    return budget;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update budget' })
  async updateBudget(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<CreateBudgetDto>,
  ): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({ where: { id } });

    if (!budget) {
      throw new NotFoundException(`Budget not found: ${id}`);
    }

    Object.assign(budget, updateDto);

    return this.budgetRepository.save(budget);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete budget' })
  async deleteBudget(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const result = await this.budgetRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Budget not found: ${id}`);
    }
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to budget' })
  async addItem(
    @Param('id', ParseUUIDPipe) budgetId: string,
    @Body() dto: CreateBudgetItemDto,
  ): Promise<BudgetItem> {
    // Verify budget exists
    const budget = await this.budgetRepository.findOne({ where: { id: budgetId } });
    if (!budget) {
      throw new NotFoundException(`Budget not found: ${budgetId}`);
    }

    // Verify concept exists
    const concept = await this.conceptRepository.findOne({
      where: { id: dto.conceptId },
      relations: ['unitPriceAnalysis'],
    });

    if (!concept) {
      throw new NotFoundException(`Concept not found: ${dto.conceptId}`);
    }

    if (!concept.unitPriceAnalysis) {
      throw new Error(`Concept ${concept.code} has no unit price analysis`);
    }

    // Create item
    const item = this.itemRepository.create({
      budgetId,
      conceptId: dto.conceptId,
      spaceId: dto.spaceId,
      quantity: dto.quantity,
      unit: concept.unit,
      unitPrice: Number(concept.unitPriceAnalysis.totalUnitPrice),
      subtotal: dto.quantity * Number(concept.unitPriceAnalysis.totalUnitPrice),
    });

    const savedItem = await this.itemRepository.save(item);

    // Recalculate budget totals
    await this.calculateBudgetUseCase.execute(budgetId);

    return savedItem;
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Delete budget item' })
  async deleteItem(@Param('itemId', ParseUUIDPipe) itemId: string): Promise<void> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });

    if (!item) {
      throw new NotFoundException(`Budget item not found: ${itemId}`);
    }

    const budgetId = item.budgetId;

    await this.itemRepository.remove(item);

    // Recalculate budget totals
    await this.calculateBudgetUseCase.execute(budgetId);
  }

  @Post(':id/calculate')
  @ApiOperation({ summary: 'Recalculate budget' })
  async calculate(@Param('id', ParseUUIDPipe) id: string): Promise<Budget> {
    return this.calculateBudgetUseCase.execute(id);
  }

  @Get(':id/explosion')
  @ApiOperation({ summary: 'Get material explosion' })
  async getExplosion(@Param('id', ParseUUIDPipe) id: string) {
    return this.explodeMaterialsUseCase.execute(id);
  }
}
