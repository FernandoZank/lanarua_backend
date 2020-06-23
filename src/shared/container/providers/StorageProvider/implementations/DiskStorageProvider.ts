import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

import IDiskProvider from '../models/IDiskProvider';

class DiskStorageProvider implements IDiskProvider {
  public async saveFile(file: string, imagePath: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, file),
      path.resolve(uploadConfig.uploadsFolder, imagePath, file),
    );

    return file;
  }

  public async deleteFile(file: string, imagePath: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, imagePath, file);
    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
