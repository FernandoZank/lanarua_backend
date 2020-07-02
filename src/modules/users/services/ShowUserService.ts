import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(admin: boolean, user_id: string): Promise<User> {
    if (!admin) {
      throw new AppError('Forbidden. Must be admin', 403);
    }

    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return classToClass(user);
  }
}

export default ShowUserService;
