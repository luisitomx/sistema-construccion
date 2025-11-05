import { SpacePolylineLink } from '../entities/space-polyline-link.entity';

export interface ISpacePolylineLinkRepository {
  create(link: Partial<SpacePolylineLink>): Promise<SpacePolylineLink>;
  findById(id: string): Promise<SpacePolylineLink | null>;
  findBySpaceId(spaceId: string): Promise<SpacePolylineLink[]>;
  findByPolylineId(polylineId: string): Promise<SpacePolylineLink | null>;
  delete(id: string): Promise<void>;
}
