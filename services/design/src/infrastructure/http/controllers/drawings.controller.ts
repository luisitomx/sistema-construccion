import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Query,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { Drawing } from '../../../domain/entities/drawing.entity';
import { Polyline } from '../../../domain/entities/polyline.entity';
import { Layer } from '../../../domain/entities/layer.entity';
import { UploadDrawingUseCase } from '../../../application/use-cases/upload-drawing.use-case';
import { LinkSpaceToPolylineUseCase } from '../../../application/use-cases/link-space-to-polyline.use-case';
import { UploadDrawingDto } from '../../../application/dtos/upload-drawing.dto';
import { LinkSpaceDto } from '../../../application/dtos/link-space.dto';

@ApiTags('drawings')
@Controller('api/v1/drawings')
export class DrawingsController {
  constructor(
    @InjectRepository(Drawing)
    private drawingRepository: Repository<Drawing>,
    @InjectRepository(Polyline)
    private polylineRepository: Repository<Polyline>,
    @InjectRepository(Layer)
    private layerRepository: Repository<Layer>,
    private uploadDrawingUseCase: UploadDrawingUseCase,
    private linkSpaceToPolylineUseCase: LinkSpaceToPolylineUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Upload a DWG/DXF file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDrawing(
    @UploadedFile() file: Express.Multer.File,
    @Body('projectId') projectId: string,
    @Body('name') name: string,
    @Body('userId') userId: string,
  ): Promise<Drawing> {
    const dto: UploadDrawingDto = {
      projectId,
      name,
      userId,
      file,
    };

    return this.uploadDrawingUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drawings' })
  async getDrawings(
    @Query('projectId') projectId?: string,
    @Query('skip') skip = 0,
    @Query('take') take = 10,
  ): Promise<Drawing[]> {
    const where = projectId ? { projectId } : {};
    
    return this.drawingRepository.find({
      where,
      skip,
      take,
      order: { uploadedAt: 'DESC' },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get drawing by ID' })
  async getDrawing(@Param('id', ParseUUIDPipe) id: string): Promise<Drawing> {
    const drawing = await this.drawingRepository.findOne({
      where: { id },
      relations: ['layers', 'polylines'],
    });

    if (!drawing) {
      throw new NotFoundException(`Drawing not found: ${id}`);
    }

    return drawing;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete drawing' })
  async deleteDrawing(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const result = await this.drawingRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Drawing not found: ${id}`);
    }
  }

  @Get(':id/layers')
  @ApiOperation({ summary: 'Get layers of a drawing' })
  async getDrawingLayers(@Param('id', ParseUUIDPipe) id: string): Promise<Layer[]> {
    return this.layerRepository.find({
      where: { drawingId: id },
      relations: ['polylines'],
    });
  }

  @Get(':id/polylines')
  @ApiOperation({ summary: 'Get polylines of a drawing' })
  async getDrawingPolylines(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('layerId') layerId?: string,
    @Query('closedOnly') closedOnly?: boolean,
  ): Promise<Polyline[]> {
    const where: any = { drawingId: id };
    
    if (layerId) {
      where.layerId = layerId;
    }
    
    if (closedOnly) {
      where.isClosed = true;
    }

    return this.polylineRepository.find({
      where,
      relations: ['layer', 'spaceLinks'],
      order: { area: 'DESC' },
    });
  }

  @Post('polylines/:polylineId/link')
  @ApiOperation({ summary: 'Link polyline to space' })
  async linkPolylineToSpace(
    @Param('polylineId', ParseUUIDPipe) polylineId: string,
    @Body() dto: LinkSpaceDto,
  ) {
    dto.polylineId = polylineId;
    return this.linkSpaceToPolylineUseCase.execute(dto);
  }

  @Delete('polylines/links/:linkId')
  @ApiOperation({ summary: 'Unlink polyline from space' })
  async unlinkPolylineFromSpace(@Param('linkId', ParseUUIDPipe) linkId: string): Promise<void> {
    return this.linkSpaceToPolylineUseCase.unlinkSpace(linkId);
  }

  @Get('spaces/:spaceId/polylines')
  @ApiOperation({ summary: 'Get polylines linked to a space' })
  async getSpacePolylines(@Param('spaceId', ParseUUIDPipe) spaceId: string): Promise<Polyline[]> {
    return this.linkSpaceToPolylineUseCase.getSpacePolylines(spaceId);
  }
}
