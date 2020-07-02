import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(admin: boolean): Promise<User[]> {
    if (!admin) {
      throw new AppError('Forbidden. Must be admin', 403);
    }

    const cacheKey = 'users-list';

    let users = await this.cacheProvider.recover<User[]>(cacheKey);
    // users = null;

    if (!users) {
      users = await this.usersRepository.returnAll();

      await this.cacheProvider.save(cacheKey, classToClass(users));
    }

    return classToClass(users);
  }
}

export default ListUsersService;
