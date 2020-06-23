import { inject, injectable } from 'tsyringe';
import path from 'path';
import fs from 'fs';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import { classToClass } from 'class-transformer';

import IDiskProvider from '@shared/container/providers/StorageProvider/models/IDiskProvider';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  filename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IDiskProvider,
  ) {}

  public async execute({ user_id, filename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('User does not exists.', 403);
    }

    if (user.avatar && user.avatar !== 'default.png') {
      await this.storageProvider.deleteFile(user.avatar);
      // const userAvatar = path.join(uploadConfig.uploadsFolder, user.avatar);
      // const stillExist = await fs.promises.stat(userAvatar);

      // if (stillExist) {
      //   await fs.promises.unlink(userAvatar);
      // }
    }

    const newAvatar = await this.storageProvider.saveFile(filename);

    user.avatar = newAvatar;

    await this.usersRepository.save(user);

    return classToClass(user);
  }
}

export default UpdateUserAvatarService;
