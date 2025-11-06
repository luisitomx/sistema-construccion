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
import { Schedule, ScheduleStatus } from '../../../domain/entities/schedule.entity';
import { Activity } from '../../../domain/entities/activity.entity';
import { Dependency } from '../../../domain/entities/dependency.entity';
import { CreateScheduleDto } from '../../../application/dtos/create-schedule.dto';
import { CreateActivityDto } from '../../../application/dtos/create-activity.dto';
import { CreateDependencyDto } from '../../../application/dtos/create-dependency.dto';
import { CalculateCriticalPathUseCase } from '../../../application/use-cases/calculate-critical-path.use-case';
import { GenerateGanttDataUseCase } from '../../../application/use-cases/generate-gantt-data.use-case';

@ApiTags('schedules')
@Controller('api/v1/schedules')
export class SchedulesController {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Dependency)
    private dependencyRepository: Repository<Dependency>,
    private calculateCriticalPathUseCase: CalculateCriticalPathUseCase,
    private generateGanttDataUseCase: GenerateGanttDataUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create schedule' })
  async createSchedule(@Body() dto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.scheduleRepository.create({
      projectId: dto.projectId,
      name: dto.name,
      description: dto.description,
      startDate: new Date(dto.startDate),
      status: ScheduleStatus.DRAFT,
      createdBy: dto.userId,
    });

    return this.scheduleRepository.save(schedule);
  }

  @Get()
  @ApiOperation({ summary: 'List schedules' })
  async listSchedules(
    @Query('projectId') projectId?: string,
    @Query('status') status?: ScheduleStatus,
  ): Promise<Schedule[]> {
    const where: any = {};

    if (projectId) {
      where.projectId = projectId;
    }

    if (status) {
      where.status = status;
    }

    return this.scheduleRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  async getSchedule(@Param('id', ParseUUIDPipe) id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['activities', 'activities.predecessors', 'activities.successors', 'activities.resourceAssignments'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule not found: ${id}`);
    }

    return schedule;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update schedule' })
  async updateSchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: Partial<CreateScheduleDto>,
  ): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });

    if (!schedule) {
      throw new NotFoundException(`Schedule not found: ${id}`);
    }

    Object.assign(schedule, updateDto);

    return this.scheduleRepository.save(schedule);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete schedule' })
  async deleteSchedule(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const result = await this.scheduleRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Schedule not found: ${id}`);
    }
  }

  @Post(':id/activities')
  @ApiOperation({ summary: 'Add activity to schedule' })
  async addActivity(
    @Param('id', ParseUUIDPipe) scheduleId: string,
    @Body() dto: CreateActivityDto,
  ): Promise<Activity> {
    // Verify schedule exists
    const schedule = await this.scheduleRepository.findOne({ where: { id: scheduleId } });
    if (!schedule) {
      throw new NotFoundException(`Schedule not found: ${scheduleId}`);
    }

    const activity = this.activityRepository.create({
      scheduleId,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      duration: dto.duration,
      spaceId: dto.spaceId,
      budgetItemId: dto.budgetItemId,
    });

    return this.activityRepository.save(activity);
  }

  @Get(':id/activities')
  @ApiOperation({ summary: 'Get activities of schedule' })
  async getActivities(@Param('id', ParseUUIDPipe) scheduleId: string): Promise<Activity[]> {
    return this.activityRepository.find({
      where: { scheduleId },
      relations: ['resourceAssignments', 'predecessors', 'successors'],
      order: { earlyStart: 'ASC' },
    });
  }

  @Post(':id/dependencies')
  @ApiOperation({ summary: 'Add dependency between activities' })
  async addDependency(
    @Param('id', ParseUUIDPipe) scheduleId: string,
    @Body() dto: CreateDependencyDto,
  ): Promise<Dependency> {
    // Verify both activities exist and belong to this schedule
    const predecessor = await this.activityRepository.findOne({
      where: { id: dto.predecessorId, scheduleId },
    });

    const successor = await this.activityRepository.findOne({
      where: { id: dto.successorId, scheduleId },
    });

    if (!predecessor) {
      throw new NotFoundException(`Predecessor activity not found: ${dto.predecessorId}`);
    }

    if (!successor) {
      throw new NotFoundException(`Successor activity not found: ${dto.successorId}`);
    }

    const dependency = this.dependencyRepository.create(dto);

    return this.dependencyRepository.save(dependency);
  }

  @Get(':id/dependencies')
  @ApiOperation({ summary: 'Get dependencies of schedule' })
  async getDependencies(@Param('id', ParseUUIDPipe) scheduleId: string) {
    const activities = await this.activityRepository.find({
      where: { scheduleId },
      select: ['id'],
    });

    const activityIds = activities.map(a => a.id);

    return this.dependencyRepository
      .createQueryBuilder('dep')
      .where('dep.predecessorId IN (:...ids)', { ids: activityIds })
      .andWhere('dep.successorId IN (:...ids)', { ids: activityIds })
      .leftJoinAndSelect('dep.predecessor', 'pred')
      .leftJoinAndSelect('dep.successor', 'succ')
      .getMany();
  }

  @Post(':id/calculate')
  @ApiOperation({ summary: 'Calculate critical path (CPM)' })
  async calculateCriticalPath(@Param('id', ParseUUIDPipe) id: string): Promise<Schedule> {
    return this.calculateCriticalPathUseCase.execute(id);
  }

  @Get(':id/gantt')
  @ApiOperation({ summary: 'Get Gantt chart data' })
  async getGanttData(@Param('id', ParseUUIDPipe) id: string) {
    return this.generateGanttDataUseCase.execute(id);
  }
}
