import fs from 'fs';
import path from 'path';
import { getType } from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';

import IDiskProvider from '../models/IDiskProvider';

class S3StorageProvider implements IDiskProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'sa-east-1',
    });
  }

  public async saveFile(file: string, imagePath: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalPath);

    const ContentType = getType(originalPath);

    if (!ContentType) {
      throw new Error('file not found');
    }

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: `${imagePath}/${file}`,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string, imagePath: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: `${imagePath}/${file}`,
      })
      .promise();
  }
}

export default S3StorageProvider;
