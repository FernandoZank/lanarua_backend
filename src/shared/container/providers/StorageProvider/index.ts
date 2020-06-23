import { container } from 'tsyringe';
import uploadConfig from '@config/upload';

import IDiskProvider from './models/IDiskProvider';

import Disk from './implementations/DiskStorageProvider';
import S3 from './implementations/S3StorageProvider';

const providers = {
  disk: Disk,
  s3: S3,
};

container.registerSingleton<IDiskProvider>(
  'StorageProvider',
  providers[uploadConfig.driver],
);
