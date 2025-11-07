import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitPriceAnalysis, MaterialComponent, LaborComponent, EquipmentComponent } from '../../domain/entities/unit-price-analysis.entity';
import { Material } from '../../domain/entities/material.entity';
import { Labor } from '../../domain/entities/labor.entity';
import { Equipment } from '../../domain/entities/equipment.entity';
import { CreateUnitPriceAnalysisDto } from '../dtos/create-unit-price-analysis.dto';

@Injectable()
export class CalculateUnitPriceUseCase {
  constructor(
    @InjectRepository(UnitPriceAnalysis)
    private analysisRepository: Repository<UnitPriceAnalysis>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
    @InjectRepository(Labor)
    private laborRepository: Repository<Labor>,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
  ) {}

  async execute(dto: CreateUnitPriceAnalysisDto): Promise<UnitPriceAnalysis> {
    // 1. Build material components with current prices
    const materialComponents: MaterialComponent[] = [];
    for (const matDto of dto.materials) {
      const material = await this.materialRepository.findOne({
        where: { id: matDto.materialId },
      });

      if (!material) {
        throw new NotFoundException(`Material not found: ${matDto.materialId}`);
      }

      const cost = matDto.quantity * (1 + matDto.wasteFactor) * Number(material.currentPrice);

      materialComponents.push({
        materialId: material.id,
        materialCode: material.code,
        materialName: material.name,
        materialUnit: material.unit,
        quantity: matDto.quantity,
        wasteFactor: matDto.wasteFactor,
        unitPrice: Number(material.currentPrice),
        cost,
      });
    }

    // 2. Build labor components
    const laborComponents: LaborComponent[] = [];
    for (const labDto of dto.labor) {
      const labor = await this.laborRepository.findOne({
        where: { id: labDto.laborId },
      });

      if (!labor) {
        throw new NotFoundException(`Labor not found: ${labDto.laborId}`);
      }

      const cost = labDto.hours * Number(labor.hourlyRate);

      laborComponents.push({
        laborId: labor.id,
        laborCode: labor.code,
        laborName: labor.name,
        hours: labDto.hours,
        performance: labDto.performance,
        hourlyRate: Number(labor.hourlyRate),
        cost,
      });
    }

    // 3. Build equipment components
    const equipmentComponents: EquipmentComponent[] = [];
    for (const eqDto of dto.equipment) {
      const equipment = await this.equipmentRepository.findOne({
        where: { id: eqDto.equipmentId },
      });

      if (!equipment) {
        throw new NotFoundException(`Equipment not found: ${eqDto.equipmentId}`);
      }

      const cost = eqDto.hours * Number(equipment.hourlyRate);

      equipmentComponents.push({
        equipmentId: equipment.id,
        equipmentCode: equipment.code,
        equipmentName: equipment.name,
        hours: eqDto.hours,
        hourlyRate: Number(equipment.hourlyRate),
        cost,
      });
    }

    // 4. Calculate costs
    const directCost = this.calculateDirectCost(
      materialComponents,
      laborComponents,
      equipmentComponents
    );

    const indirectCost = directCost * (dto.indirectCostFactor / 100);
    const profit = (directCost + indirectCost) * (dto.profitFactor / 100);
    const totalUnitPrice = directCost + indirectCost + profit;

    // 5. Create and save analysis
    const analysisData = {
      conceptId: dto.conceptId,
      materials: materialComponents,
      labor: laborComponents,
      equipment: equipmentComponents,
      indirectCostFactor: dto.indirectCostFactor,
      profitFactor: dto.profitFactor,
      directCost,
      indirectCost,
      profit,
      totalUnitPrice,
      validFrom: new Date(dto.validFrom),
      validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
    };

    const analysis = this.analysisRepository.create(analysisData);
    return await this.analysisRepository.save(analysis);
  }

  private calculateDirectCost(
    materials: MaterialComponent[],
    labor: LaborComponent[],
    equipment: EquipmentComponent[]
  ): number {
    const materialCost = materials.reduce((sum, m) => sum + m.cost, 0);
    const laborCost = labor.reduce((sum, l) => sum + l.cost, 0);
    const equipmentCost = equipment.reduce((sum, e) => sum + e.cost, 0);

    return materialCost + laborCost + equipmentCost;
  }

  async recalculate(analysisId: string): Promise<UnitPriceAnalysis> {
    const analysis = await this.analysisRepository.findOne({
      where: { id: analysisId },
    });

    if (!analysis) {
      throw new NotFoundException(`Analysis not found: ${analysisId}`);
    }

    // Recalculate with current prices
    const dto: CreateUnitPriceAnalysisDto = {
      conceptId: analysis.conceptId,
      materials: analysis.materials.map(m => ({
        materialId: m.materialId,
        quantity: m.quantity,
        wasteFactor: m.wasteFactor,
      })),
      labor: analysis.labor.map(l => ({
        laborId: l.laborId,
        hours: l.hours,
        performance: l.performance,
      })),
      equipment: analysis.equipment.map(e => ({
        equipmentId: e.equipmentId,
        hours: e.hours,
      })),
      indirectCostFactor: Number(analysis.indirectCostFactor),
      profitFactor: Number(analysis.profitFactor),
      validFrom: analysis.validFrom.toISOString(),
      validUntil: analysis.validUntil?.toISOString(),
    };

    // Delete old and create new
    await this.analysisRepository.remove(analysis);
    return this.execute(dto);
  }
}
