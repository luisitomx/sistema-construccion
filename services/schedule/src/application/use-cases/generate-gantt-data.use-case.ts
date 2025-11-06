import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../../domain/entities/schedule.entity';
import { Activity } from '../../domain/entities/activity.entity';
import { Dependency } from '../../domain/entities/dependency.entity';
import { addDays, format } from 'date-fns';

export interface GanttTask {
  id: string;
  code: string;
  name: string;
  start: string;
  end: string;
  duration: number;
  progress: number;
  dependencies: string[];
  isCritical: boolean;
  totalFloat: number;
  resources: string[];
}

export interface GanttData {
  tasks: GanttTask[];
  criticalPath: string[];
  startDate: string;
  endDate: string;
  totalDuration: number;
}

@Injectable()
export class GenerateGanttDataUseCase {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Dependency)
    private dependencyRepository: Repository<Dependency>,
  ) {}

  async execute(scheduleId: string): Promise<GanttData> {
    // Load schedule with activities
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['activities', 'activities.resourceAssignments'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule not found: ${scheduleId}`);
    }

    // Load dependencies
    const activityIds = schedule.activities.map(a => a.id);
    const dependencies = await this.dependencyRepository
      .createQueryBuilder('dep')
      .where('dep.predecessorId IN (:...ids)', { ids: activityIds })
      .andWhere('dep.successorId IN (:...ids)', { ids: activityIds })
      .getMany();

    // Build dependency map
    const depMap = new Map<string, string[]>();
    for (const dep of dependencies) {
      const deps = depMap.get(dep.successorId) || [];
      deps.push(dep.predecessorId);
      depMap.set(dep.successorId, deps);
    }

    // Build tasks
    const tasks: GanttTask[] = schedule.activities.map(activity => {
      const startDate = addDays(new Date(schedule.startDate), activity.earlyStart);
      const endDate = addDays(new Date(schedule.startDate), activity.earlyFinish);

      return {
        id: activity.id,
        code: activity.code,
        name: activity.name,
        start: format(startDate, 'yyyy-MM-dd'),
        end: format(endDate, 'yyyy-MM-dd'),
        duration: activity.duration,
        progress: Number(activity.percentComplete),
        dependencies: depMap.get(activity.id) || [],
        isCritical: activity.isCritical,
        totalFloat: activity.totalFloat,
        resources: activity.resourceAssignments?.map(r => r.resourceName) || [],
      };
    });

    return {
      tasks,
      criticalPath: schedule.criticalPath || [],
      startDate: format(new Date(schedule.startDate), 'yyyy-MM-dd'),
      endDate: schedule.endDate ? format(new Date(schedule.endDate), 'yyyy-MM-dd') : '',
      totalDuration: schedule.totalDuration,
    };
  }
}
