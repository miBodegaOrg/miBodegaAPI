import { PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class R2Service {
    private readonly s3Client: S3Client;
    private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'enam',
      endpoint: this.configService.get<string>('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME');
  }

  async uploadFile(body: Buffer, contentType: string): Promise<string> {
    try {
        const key = uuidv4();

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: body,
            ContentType: contentType,
        });
        await this.s3Client.send(command);

        return `https://pub-67cf39beb81c4c46a109e7c06577c1a4.r2.dev/${key}`;
    } catch (error) {
      throw new HttpException('Error uploading image', 500);
    }
  }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        await this.s3Client.send(command);
    }
}
