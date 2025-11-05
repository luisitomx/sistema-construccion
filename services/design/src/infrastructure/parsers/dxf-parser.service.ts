import { Injectable, Logger } from '@nestjs/common';
import * as DxfParser from 'dxf-parser';
import { Vertex } from '../../domain/entities/polyline.entity';

export interface ParsedDrawing {
  version: string;
  units: string;
  boundingBox: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } | null;
  layers: LayerData[];
  polylines: PolylineData[];
}

export interface LayerData {
  name: string;
  color: string;
  isVisible: boolean;
  isFrozen: boolean;
}

export interface PolylineData {
  layerName: string;
  vertices: Vertex[];
  isClosed: boolean;
  color: string;
  area: number;
  perimeter: number;
}

@Injectable()
export class DxfParserService {
  private readonly logger = new Logger(DxfParserService.name);
  private parser: DxfParser;

  constructor() {
    this.parser = new DxfParser();
  }

  async parse(fileContent: string): Promise<ParsedDrawing> {
    try {
      this.logger.log('Starting DXF parsing...');
      
      const dxf = this.parser.parseSync(fileContent);
      
      if (!dxf) {
        throw new Error('Failed to parse DXF file');
      }

      const layers = this.extractLayers(dxf.tables?.layer);
      const polylines = this.extractPolylines(dxf.entities || []);
      const boundingBox = this.calculateBoundingBox(polylines);

      this.logger.log(`Parsed ${layers.length} layers and ${polylines.length} polylines`);

      return {
        version: dxf.header?.$ACADVER || 'Unknown',
        units: this.detectUnits(dxf.header?.$INSUNITS),
        boundingBox,
        layers,
        polylines,
      };
    } catch (error) {
      this.logger.error('Error parsing DXF:', error);
      throw new Error(`DXF parsing failed: ${error.message}`);
    }
  }

  private extractLayers(layersTable: any): LayerData[] {
    if (!layersTable || !layersTable.layers) {
      return [];
    }

    return Object.values(layersTable.layers).map((layer: any) => ({
      name: layer.name || 'Default',
      color: this.convertColor(layer.color),
      isVisible: !layer.visible || layer.visible === true,
      isFrozen: layer.frozen || false,
    }));
  }

  private extractPolylines(entities: any[]): PolylineData[] {
    const polylines: PolylineData[] = [];

    for (const entity of entities) {
      if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
        const vertices = this.extractVertices(entity);
        
        if (vertices.length < 3) {
          continue; // Skip lines with less than 3 vertices
        }

        const isClosed = entity.shape || false;
        const area = isClosed ? this.calculateArea(vertices) : 0;
        const perimeter = this.calculatePerimeter(vertices, isClosed);

        polylines.push({
          layerName: entity.layer || '0',
          vertices,
          isClosed,
          color: this.convertColor(entity.color),
          area,
          perimeter,
        });
      }
    }

    return polylines;
  }

  private extractVertices(entity: any): Vertex[] {
    const vertices: Vertex[] = [];

    if (entity.vertices) {
      for (const vertex of entity.vertices) {
        vertices.push({
          x: vertex.x || 0,
          y: vertex.y || 0,
          bulge: vertex.bulge,
        });
      }
    }

    return vertices;
  }

  private calculateArea(vertices: Vertex[]): number {
    if (vertices.length < 3) {
      return 0;
    }

    // Shoelace formula (Gauss area formula)
    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
      const j = (i + 1) % vertices.length;
      area += vertices[i].x * vertices[j].y;
      area -= vertices[j].x * vertices[i].y;
    }

    return Math.abs(area / 2);
  }

  private calculatePerimeter(vertices: Vertex[], isClosed: boolean): number {
    let perimeter = 0;

    for (let i = 0; i < vertices.length - 1; i++) {
      const dx = vertices[i + 1].x - vertices[i].x;
      const dy = vertices[i + 1].y - vertices[i].y;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }

    // If closed, add distance from last to first vertex
    if (isClosed && vertices.length > 0) {
      const dx = vertices[0].x - vertices[vertices.length - 1].x;
      const dy = vertices[0].y - vertices[vertices.length - 1].y;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }

    return perimeter;
  }

  private calculateBoundingBox(polylines: PolylineData[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } | null {
    if (polylines.length === 0) {
      return null;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const polyline of polylines) {
      for (const vertex of polyline.vertices) {
        minX = Math.min(minX, vertex.x);
        minY = Math.min(minY, vertex.y);
        maxX = Math.max(maxX, vertex.x);
        maxY = Math.max(maxY, vertex.y);
      }
    }

    return { minX, minY, maxX, maxY };
  }

  private detectUnits(insunits: number | undefined): string {
    // DXF INSUNITS values
    const unitsMap: { [key: number]: string } = {
      0: 'unitless',
      1: 'inches',
      2: 'feet',
      3: 'miles',
      4: 'millimeters',
      5: 'centimeters',
      6: 'meters',
      7: 'kilometers',
      8: 'microinches',
      9: 'mils',
      10: 'yards',
      11: 'angstroms',
      12: 'nanometers',
      13: 'microns',
      14: 'decimeters',
      15: 'decameters',
      16: 'hectometers',
      17: 'gigameters',
      18: 'astronomical units',
      19: 'light years',
      20: 'parsecs',
    };

    return unitsMap[insunits || 0] || 'meters';
  }

  private convertColor(colorCode: number | undefined): string {
    if (!colorCode) {
      return '#FFFFFF';
    }

    // AutoCAD Color Index (ACI) to RGB conversion (simplified)
    const aciColors: { [key: number]: string } = {
      1: '#FF0000', // Red
      2: '#FFFF00', // Yellow
      3: '#00FF00', // Green
      4: '#00FFFF', // Cyan
      5: '#0000FF', // Blue
      6: '#FF00FF', // Magenta
      7: '#FFFFFF', // White
      8: '#808080', // Gray
      9: '#C0C0C0', // Light Gray
    };

    return aciColors[colorCode] || '#FFFFFF';
  }
}
