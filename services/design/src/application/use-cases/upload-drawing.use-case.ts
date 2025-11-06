import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drawing, DrawingStatus, FileType } from '../../domain/entities/drawing.entity';
import { Layer } from '../../domain/entities/layer.entity';
import { Polyline } from '../../domain/entities/polyline.entity';
import { StorageService } from '../../infrastructure/storage/storage.service';
import { DxfParserService } from '../../infrastructure/parsers/dxf-parser.service';
import { UploadDrawingDto } from '../dtos/upload-drawing.dto';

@Injectable()
export class UploadDrawingUseCase {
  private readonly logger = new Logger(UploadDrawingUseCase.name);

  constructor(
    @InjectRepository(Drawing)
    private drawingRepository: Repository<Drawing>,
    @InjectRepository(Layer)
    private layerRepository: Repository<Layer>,
    @InjectRepository(Polyline)
    private polylineRepository: Repository<Polyline>,
    private storageService: StorageService,
    private dxfParserService: DxfParserService,
  ) {}

  async execute(dto: UploadDrawingDto): Promise<Drawing> {
    // 1. Upload file to S3/MinIO
    const fileUrl = await this.storageService.upload(dto.file, dto.projectId);

    // 2. Detect file type
    const fileType = this.detectFileType(dto.file.originalname);

    // 3. Create drawing record
    const drawing = this.drawingRepository.create({
      projectId: dto.projectId,
      name: dto.name,
      fileName: dto.file.originalname,
      fileUrl,
      fileSize: dto.file.size,
      fileType,
      uploadedBy: dto.userId,
      status: DrawingStatus.UPLOADED,
    });

    const savedDrawing = await this.drawingRepository.save(drawing);

    this.logger.log(`Drawing uploaded: ${savedDrawing.id}`);

    // 4. Start async processing (fire and forget)
    this.processDrawingAsync(savedDrawing.id).catch((error) => {
      this.logger.error(`Error in async processing for drawing ${savedDrawing.id}:`, error);
    });

    return savedDrawing;
  }

  private async processDrawingAsync(drawingId: string): Promise<void> {
    try {
      // Update status to PROCESSING
      await this.drawingRepository.update(drawingId, {
        status: DrawingStatus.PROCESSING,
      });

      // Get drawing
      const drawing = await this.drawingRepository.findOne({
        where: { id: drawingId },
      });

      if (!drawing) {
        throw new Error('Drawing not found');
      }

      // Download file from S3
      const fileBuffer = await this.storageService.download(drawing.fileUrl);
      const fileContent = fileBuffer.toString('utf-8');

      // Parse DXF
      const parsed = await this.dxfParserService.parse(fileContent);

      // Save layers
      const layers = await Promise.all(
        parsed.layers.map((layerData) =>
          this.layerRepository.save({
            drawingId: drawing.id,
            name: layerData.name,
            color: layerData.color,
            isVisible: layerData.isVisible,
            isFrozen: layerData.isFrozen,
          })
        )
      );

      // Create a map of layer names to layer IDs
      const layerMap = new Map<string, string>();
      layers.forEach((layer) => {
        layerMap.set(layer.name, layer.id);
      });

      // Save polylines
      await Promise.all(
        parsed.polylines.map((polylineData) => {
          const layerId = layerMap.get(polylineData.layerName) || layers[0]?.id;
          
          if (!layerId) {
            this.logger.warn(`No layer found for polyline on layer: ${polylineData.layerName}`);
            return Promise.resolve();
          }

          return this.polylineRepository.save({
            drawingId: drawing.id,
            layerId,
            vertices: polylineData.vertices,
            isClosed: polylineData.isClosed,
            area: polylineData.area,
            perimeter: polylineData.perimeter,
            color: polylineData.color,
          });
        })
      );

      // Update drawing status
      await this.drawingRepository.update(drawingId, {
        status: DrawingStatus.PARSED,
        version: parsed.version,
        units: parsed.units,
        boundingBox: parsed.boundingBox || undefined,
        layersCount: parsed.layers.length,
        polylinesCount: parsed.polylines.length,
        parsedAt: new Date(),
      });

      this.logger.log(`Drawing processed successfully: ${drawingId}`);
    } catch (error) {
      this.logger.error(`Error processing drawing ${drawingId}:`, error);
      
      await this.drawingRepository.update(drawingId, {
        status: DrawingStatus.ERROR,
        errorMessage: error.message,
      });
    }
  }

  private detectFileType(filename: string): FileType {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (extension === 'dxf') {
      return FileType.DXF;
    } else if (extension === 'dwg') {
      return FileType.DWG;
    }
    
    return FileType.DXF; // Default to DXF
  }
}
