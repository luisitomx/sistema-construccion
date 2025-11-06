import { Polyline } from '../entities/polyline.entity';

export interface IPolylineRepository {
  create(polyline: Partial<Polyline>): Promise<Polyline>;
  findById(id: string): Promise<Polyline | null>;
  findByDrawingId(drawingId: string): Promise<Polyline[]>;
  findByLayerId(layerId: string): Promise<Polyline[]>;
  update(id: string, data: Partial<Polyline>): Promise<Polyline>;
  delete(id: string): Promise<void>;
}
