import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../../../domain/entities/photo.entity';
import { Activity } from '../../../domain/entities/activity.entity';
import { CreatePhotoDto } from '../../../application/dtos/create-photo.dto';

@ApiTags('photos')
@Controller('photos')
export class PhotosController {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Upload a new photo from mobile app' })
  @ApiResponse({ status: 201, description: 'Photo created successfully' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  async create(@Body() dto: CreatePhotoDto): Promise<Photo> {
    // Verify activity exists
    const activity = await this.activityRepository.findOne({
      where: { id: dto.activityId },
    });

    if (!activity) {
      throw new NotFoundException(`Activity ${dto.activityId} not found`);
    }

    const photo = this.photoRepository.create({
      activityId: dto.activityId,
      remoteUrl: dto.remoteUrl,
      caption: dto.caption || '',
      takenBy: dto.takenBy,
      takenAt: new Date(dto.takenAt),
    });

    return this.photoRepository.save(photo);
  }

  @Get('activity/:activityId')
  @ApiOperation({ summary: 'Get all photos for an activity' })
  @ApiResponse({ status: 200, description: 'Photos retrieved successfully' })
  async getByActivity(
    @Param('activityId', ParseUUIDPipe) activityId: string,
  ): Promise<Photo[]> {
    return this.photoRepository.find({
      where: { activityId },
      order: { takenAt: 'DESC' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific photo by ID' })
  @ApiResponse({ status: 200, description: 'Photo retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<Photo> {
    const photo = await this.photoRepository.findOne({ where: { id } });

    if (!photo) {
      throw new NotFoundException(`Photo ${id} not found`);
    }

    return photo;
  }
}
