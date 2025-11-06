import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { WorkLog } from '../../../domain/entities/work-log.entity';
import { Activity } from '../../../domain/entities/activity.entity';
import { CreateWorkLogDto } from '../../../application/dtos/create-work-log.dto';

@ApiTags('work-logs')
@Controller('work-logs')
export class WorkLogsController {
  constructor(
    @InjectRepository(WorkLog)
    private readonly workLogRepository: Repository<WorkLog>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work log entry from mobile app' })
  @ApiResponse({ status: 201, description: 'Work log created successfully' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  async create(@Body() dto: CreateWorkLogDto): Promise<WorkLog> {
    // Verify activity exists
    const activity = await this.activityRepository.findOne({
      where: { id: dto.activityId },
    });

    if (!activity) {
      throw new NotFoundException(`Activity ${dto.activityId} not found`);
    }

    const workLog = this.workLogRepository.create({
      activityId: dto.activityId,
      logDate: new Date(dto.logDate),
      workDone: dto.workDone,
      hoursWorked: dto.hoursWorked,
      workersCount: dto.workersCount,
      progressPercentage: dto.progressPercentage,
      notes: dto.notes || '',
      weather: dto.weather,
      reportedBy: dto.reportedBy,
    });

    return this.workLogRepository.save(workLog);
  }

  @Get('activity/:activityId')
  @ApiOperation({ summary: 'Get all work logs for an activity' })
  @ApiResponse({ status: 200, description: 'Work logs retrieved successfully' })
  async getByActivity(
    @Param('activityId', ParseUUIDPipe) activityId: string,
  ): Promise<WorkLog[]> {
    return this.workLogRepository.find({
      where: { activityId },
      order: { logDate: 'DESC' },
    });
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get work logs for a date range' })
  @ApiResponse({ status: 200, description: 'Work logs retrieved successfully' })
  async getByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('activityId') activityId?: string,
  ): Promise<WorkLog[]> {
    const where: any = {
      logDate: Between(new Date(startDate), new Date(endDate)),
    };

    if (activityId) {
      where.activityId = activityId;
    }

    return this.workLogRepository.find({
      where,
      order: { logDate: 'DESC' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific work log by ID' })
  @ApiResponse({ status: 200, description: 'Work log retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Work log not found' })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<WorkLog> {
    const workLog = await this.workLogRepository.findOne({ where: { id } });

    if (!workLog) {
      throw new NotFoundException(`Work log ${id} not found`);
    }

    return workLog;
  }
}
