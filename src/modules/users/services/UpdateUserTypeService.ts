import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  user_type: string;
  admin: boolean;
}

@injectable()
class UpdateUserTypeService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, user_type, admin }: IRequest): Promise<User> {
    if (!admin) {
      throw new AppError('Forbidden. Must be admin', 403);
    }

    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    Object.assign(user, {
      ...user,
      user_type,
    });

    await this.usersRepository.save(user);
    await this.cacheProvider.invalidate('users-list');

    return classToClass(user);
  }
}

export default UpdateUserTypeService;
