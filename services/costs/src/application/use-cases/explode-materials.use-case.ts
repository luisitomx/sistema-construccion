import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from '../../domain/entities/budget.entity';

export interface MaterialExplosion {
  materialId: string;
  materialCode: string;
  materialName: string;
  materialUnit: string;
  quantity: number;
  unitPrice: number;
  totalCost: number;
}

export interface LaborExplosion {
  laborId: string;
  laborCode: string;
  laborName: string;
  hours: number;
  hourlyRate: number;
  totalCost: number;
}

export interface EquipmentExplosion {
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  hours: number;
  hourlyRate: number;
  totalCost: number;
}

export interface BudgetExplosion {
  materials: MaterialExplosion[];
  labor: LaborExplosion[];
  equipment: EquipmentExplosion[];
  totals: {
    materialsCost: number;
    laborCost: number;
    equipmentCost: number;
    directCost: number;
    indirectCost: number;
    profit: number;
    total: number;
  };
}

@Injectable()
export class ExplodeMaterialsUseCase {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
  ) {}

  async execute(budgetId: string): Promise<BudgetExplosion> {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId },
      relations: ['items', 'items.concept', 'items.concept.unitPriceAnalysis'],
    });

    if (!budget) {
      throw new NotFoundException(`Budget not found: ${budgetId}`);
    }

    const materialsMap = new Map<string, MaterialExplosion>();
    const laborMap = new Map<string, LaborExplosion>();
    const equipmentMap = new Map<string, EquipmentExplosion>();

    // Iterate through each budget item
    for (const item of budget.items) {
      const analysis = item.concept.unitPriceAnalysis;

      if (!analysis) {
        continue;
      }

      const itemQuantity = Number(item.quantity);

      // Explode materials
      for (const materialComp of analysis.materials) {
        const totalQuantity = itemQuantity * materialComp.quantity * (1 + materialComp.wasteFactor);
        const totalCost = totalQuantity * materialComp.unitPrice;

        const key = materialComp.materialId;

        if (materialsMap.has(key)) {
          const existing = materialsMap.get(key)!;
          existing.quantity += totalQuantity;
          existing.totalCost += totalCost;
        } else {
          materialsMap.set(key, {
            materialId: materialComp.materialId,
            materialCode: materialComp.materialCode,
            materialName: materialComp.materialName,
            materialUnit: materialComp.materialUnit,
            quantity: totalQuantity,
            unitPrice: materialComp.unitPrice,
            totalCost,
          });
        }
      }

      // Explode labor
      for (const laborComp of analysis.labor) {
        const totalHours = itemQuantity * laborComp.hours;
        const totalCost = totalHours * laborComp.hourlyRate;

        const key = laborComp.laborId;

        if (laborMap.has(key)) {
          const existing = laborMap.get(key)!;
          existing.hours += totalHours;
          existing.totalCost += totalCost;
        } else {
          laborMap.set(key, {
            laborId: laborComp.laborId,
            laborCode: laborComp.laborCode,
            laborName: laborComp.laborName,
            hours: totalHours,
            hourlyRate: laborComp.hourlyRate,
            totalCost,
          });
        }
      }

      // Explode equipment
      for (const equipmentComp of analysis.equipment) {
        const totalHours = itemQuantity * equipmentComp.hours;
        const totalCost = totalHours * equipmentComp.hourlyRate;

        const key = equipmentComp.equipmentId;

        if (equipmentMap.has(key)) {
          const existing = equipmentMap.get(key)!;
          existing.hours += totalHours;
          existing.totalCost += totalCost;
        } else {
          equipmentMap.set(key, {
            equipmentId: equipmentComp.equipmentId,
            equipmentCode: equipmentComp.equipmentCode,
            equipmentName: equipmentComp.equipmentName,
            hours: totalHours,
            hourlyRate: equipmentComp.hourlyRate,
            totalCost,
          });
        }
      }
    }

    // Calculate totals
    const materialsCost = Array.from(materialsMap.values()).reduce(
      (sum, m) => sum + m.totalCost,
      0
    );
    const laborCost = Array.from(laborMap.values()).reduce(
      (sum, l) => sum + l.totalCost,
      0
    );
    const equipmentCost = Array.from(equipmentMap.values()).reduce(
      (sum, e) => sum + e.totalCost,
      0
    );

    const directCost = materialsCost + laborCost + equipmentCost;

    return {
      materials: Array.from(materialsMap.values()).sort((a, b) =>
        a.materialCode.localeCompare(b.materialCode)
      ),
      labor: Array.from(laborMap.values()).sort((a, b) =>
        a.laborCode.localeCompare(b.laborCode)
      ),
      equipment: Array.from(equipmentMap.values()).sort((a, b) =>
        a.equipmentCode.localeCompare(b.equipmentCode)
      ),
      totals: {
        materialsCost,
        laborCost,
        equipmentCost,
        directCost,
        indirectCost: Number(budget.indirectCosts),
        profit: Number(budget.profit),
        total: Number(budget.total),
      },
    };
  }
}
