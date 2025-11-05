import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client: S3Client;
  private bucket: string;
  private endpoint: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT', 'http://localhost:9000');
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID', 'minioadmin');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY', 'minioadmin');

    this.bucket = this.configService.get<string>('S3_BUCKET_NAME', 'construccion-drawings');
    this.endpoint = endpoint;

    this.client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Required for MinIO
    });

    this.logger.log(`Storage service initialized with endpoint: ${endpoint}`);
  }

  async upload(file: Express.Multer.File, projectId: string): Promise<string> {
    try {
      const key = `drawings/${projectId}/${uuidv4()}-${file.originalname}`;

      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const fileUrl = `${this.endpoint}/${this.bucket}/${key}`;
      
      this.logger.log(`File uploaded successfully: ${fileUrl}`);
      
      return fileUrl;
    } catch (error) {
      this.logger.error('Error uploading file to S3:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async download(url: string): Promise<Buffer> {
    try {
      const key = this.extractKeyFromUrl(url);

      const response = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );

      const buffer = await this.streamToBuffer(response.Body as any);
      
      this.logger.log(`File downloaded successfully: ${key}`);
      
      return buffer;
    } catch (error) {
      this.logger.error('Error downloading file from S3:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  async delete(url: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(url);

      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );

      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error('Error deleting file from S3:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  private extractKeyFromUrl(url: string): string {
    // Extract key from URL like: http://localhost:9000/bucket/drawings/project-id/file.dxf
    const parts = url.split(`/${this.bucket}/`);
    if (parts.length < 2) {
      throw new Error('Invalid S3 URL');
    }
    return parts[1];
  }

  private async streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
