import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpacePolylineLink, LinkType } from '../../domain/entities/space-polyline-link.entity';
import { Polyline } from '../../domain/entities/polyline.entity';
import { ProgramaServiceClient } from '../../infrastructure/http/programa-service.client';
import { LinkSpaceDto } from '../dtos/link-space.dto';

@Injectable()
export class LinkSpaceToPolylineUseCase {
  private readonly logger = new Logger(LinkSpaceToPolylineUseCase.name);

  constructor(
    @InjectRepository(SpacePolylineLink)
    private linkRepository: Repository<SpacePolylineLink>,
    @InjectRepository(Polyline)
    private polylineRepository: Repository<Polyline>,
    private programaServiceClient: ProgramaServiceClient,
  ) {}

  async execute(dto: LinkSpaceDto): Promise<SpacePolylineLink> {
    // 1. Verify space exists in Programa service
    try {
      await this.programaServiceClient.getSpace(dto.spaceId);
    } catch (error) {
      throw new NotFoundException(`Space not found: ${dto.spaceId}`);
    }

    // 2. Verify polyline exists and is closed
    const polyline = await this.polylineRepository.findOne({
      where: { id: dto.polylineId },
    });

    if (!polyline) {
      throw new NotFoundException(`Polyline not found: ${dto.polylineId}`);
    }

    if (!polyline.isClosed) {
      throw new BadRequestException('Polyline must be closed to calculate area');
    }

    // 3. Check if link already exists
    const existingLink = await this.linkRepository.findOne({
      where: { polylineId: dto.polylineId },
    });

    if (existingLink) {
      throw new BadRequestException('Polyline is already linked to a space');
    }

    // 4. Create link
    const link = this.linkRepository.create({
      spaceId: dto.spaceId,
      polylineId: dto.polylineId,
      linkType: LinkType.MANUAL,
      linkedBy: dto.userId,
    });

    const savedLink = await this.linkRepository.save(link);

    this.logger.log(`Created link: Space ${dto.spaceId} -> Polyline ${dto.polylineId}`);

    // 5. Update space real area in Programa service
    try {
      await this.programaServiceClient.updateSpaceRealArea(
        dto.spaceId,
        Number(polyline.area)
      );
      this.logger.log(`Updated real area for space ${dto.spaceId}: ${polyline.area} m²`);
    } catch (error) {
      this.logger.error(`Failed to update space real area:`, error);
      // Don't throw - link is created, just log the error
    }

    return savedLink;
  }

  async unlinkSpace(linkId: string): Promise<void> {
    const link = await this.linkRepository.findOne({
      where: { id: linkId },
    });

    if (!link) {
      throw new NotFoundException(`Link not found: ${linkId}`);
    }

    // Remove link
    await this.linkRepository.remove(link);

    // Reset real area in Programa service
    try {
      await this.programaServiceClient.updateSpaceRealArea(link.spaceId, 0);
      this.logger.log(`Reset real area for space ${link.spaceId}`);
    } catch (error) {
      this.logger.error(`Failed to reset space real area:`, error);
    }
  }

  async getSpacePolylines(spaceId: string): Promise<Polyline[]> {
    const links = await this.linkRepository.find({
      where: { spaceId },
      relations: ['polyline'],
    });

    return links.map((link) => link.polyline);
  }
}
