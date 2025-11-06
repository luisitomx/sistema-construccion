import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface Space {
  id: string;
  name: string;
  requiredArea: number;
  realArea?: number;
}

@Injectable()
export class ProgramaServiceClient {
  private readonly logger = new Logger(ProgramaServiceClient.name);
  private client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const baseURL = this.configService.get<string>(
      'PROGRAMA_SERVICE_URL',
      'http://localhost:3001/api/v1'
    );

    this.client = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger.log(`Programa Service Client initialized: ${baseURL}`);
  }

  async getSpace(spaceId: string): Promise<Space> {
    try {
      const response = await this.client.get(`/spaces/${spaceId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching space ${spaceId}:`, error.message);
      throw new Error(`Failed to fetch space: ${error.message}`);
    }
  }

  async updateSpaceRealArea(spaceId: string, realArea: number): Promise<Space> {
    try {
      const response = await this.client.patch(`/spaces/${spaceId}`, {
        realArea,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Error updating space ${spaceId}:`, error.message);
      throw new Error(`Failed to update space real area: ${error.message}`);
    }
  }
}
