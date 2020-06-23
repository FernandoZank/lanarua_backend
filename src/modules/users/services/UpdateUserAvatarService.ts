import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

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

    const imagePath = 'users';

    if (user.avatar && user.avatar !== 'default.png') {
      await this.storageProvider.deleteFile(user.avatar, imagePath);
    }

    const newAvatar = await this.storageProvider.saveFile(filename, imagePath);

    user.avatar = newAvatar;

    await this.usersRepository.save(user);

    return classToClass(user);
  }
}

export default UpdateUserAvatarService;
