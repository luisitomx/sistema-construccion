import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from '../../domain/entities/budget.entity';
import { BudgetItem } from '../../domain/entities/budget-item.entity';

@Injectable()
export class CalculateBudgetUseCase {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(BudgetItem)
    private itemRepository: Repository<BudgetItem>,
  ) {}

  async execute(budgetId: string): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId },
      relations: ['items', 'items.concept', 'items.concept.unitPriceAnalysis'],
    });

    if (!budget) {
      throw new NotFoundException(`Budget not found: ${budgetId}`);
    }

    let subtotal = 0;

    // Calculate each item
    for (const item of budget.items) {
      const analysis = item.concept.unitPriceAnalysis;

      if (!analysis) {
        throw new Error(`No unit price analysis for concept ${item.concept.code}`);
      }

      // Update item with current unit price from analysis
      item.unitPrice = Number(analysis.totalUnitPrice);
      item.subtotal = Number(item.quantity) * item.unitPrice;
      subtotal += item.subtotal;

      // Save updated item
      await this.itemRepository.save(item);
    }

    // Calculate budget totals (15% indirect costs, 10% profit - configurable)
    budget.subtotal = subtotal;
    budget.indirectCosts = subtotal * 0.15;
    budget.profit = (subtotal + budget.indirectCosts) * 0.10;
    budget.total = subtotal + budget.indirectCosts + budget.profit;

    return this.budgetRepository.save(budget);
  }

  async recalculateItem(itemId: string): Promise<BudgetItem> {
    const item = await this.itemRepository.findOne({
      where: { id: itemId },
      relations: ['concept', 'concept.unitPriceAnalysis'],
    });

    if (!item) {
      throw new NotFoundException(`Budget item not found: ${itemId}`);
    }

    const analysis = item.concept.unitPriceAnalysis;

    if (!analysis) {
      throw new Error(`No unit price analysis for concept ${item.concept.code}`);
    }

    // Update item
    item.unitPrice = Number(analysis.totalUnitPrice);
    item.subtotal = Number(item.quantity) * item.unitPrice;

    await this.itemRepository.save(item);

    // Recalculate budget totals
    await this.updateBudgetTotals(item.budgetId);

    return item;
  }

  private async updateBudgetTotals(budgetId: string): Promise<void> {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId },
      relations: ['items'],
    });

    if (!budget) {
      return;
    }

    budget.subtotal = budget.items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );
    budget.indirectCosts = budget.subtotal * 0.15;
    budget.profit = (budget.subtotal + budget.indirectCosts) * 0.10;
    budget.total = budget.subtotal + budget.indirectCosts + budget.profit;

    await this.budgetRepository.save(budget);
  }
}
