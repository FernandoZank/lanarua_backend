import { getCustomRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import UsersRepository from '../repositories/UsersRepository';
import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';
import User from '../models/User';

interface IRequest {
  user_id: string;
  filename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, filename }: IRequest): Promise<User> {
    const userRepo = getCustomRepository(UsersRepository);

    const user = await userRepo.findOne(user_id);

    if (!user) {
      throw new AppError('User does not exists.', 403);
    }

    if (user.avatar && user.avatar !== 'default.png') {
      const userAvatar = path.join(uploadConfig.directory, user.avatar);
      const stillExist = await fs.promises.stat(userAvatar);

      if (stillExist) {
        await fs.promises.unlink(userAvatar);
      }
    }

    user.avatar = filename;

    await userRepo.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
