import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../../domain/entities/schedule.entity';
import { Activity } from '../../domain/entities/activity.entity';
import { Dependency } from '../../domain/entities/dependency.entity';
import { CPMCalculator } from './cpm-calculator.service';

@Injectable()
export class CalculateCriticalPathUseCase {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Dependency)
    private dependencyRepository: Repository<Dependency>,
    private cpmCalculator: CPMCalculator,
  ) {}

  async execute(scheduleId: string): Promise<Schedule> {
    // Load schedule with activities
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['activities'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule not found: ${scheduleId}`);
    }

    if (schedule.activities.length === 0) {
      throw new Error('Schedule has no activities');
    }

    // Load all dependencies for these activities
    const activityIds = schedule.activities.map(a => a.id);
    const dependencies = await this.dependencyRepository
      .createQueryBuilder('dep')
      .where('dep.predecessorId IN (:...ids)', { ids: activityIds })
      .andWhere('dep.successorId IN (:...ids)', { ids: activityIds })
      .getMany();

    // Calculate CPM
    const result = this.cpmCalculator.calculate(schedule.activities, dependencies);

    // Save updated activities
    await this.activityRepository.save(result.activities);

    // Update schedule
    schedule.totalDuration = result.totalDuration;
    schedule.criticalPath = result.criticalPath;
    schedule.endDate = this.calculateEndDate(schedule.startDate, result.totalDuration);

    await this.scheduleRepository.save(schedule);

    return schedule;
  }

  private calculateEndDate(startDate: Date, duration: number): Date {
    const date = new Date(startDate);
    date.setDate(date.getDate() + duration);
    return date;
  }
}
