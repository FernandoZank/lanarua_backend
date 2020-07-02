import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  lastname: string;
  email: string;
  birthday: Date;
  phone?: string;
  mobile?: string;
  address?: string;
  address_number?: number;
  aditional_info?: string;
  city?: string;
  cap?: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(data: IRequest): Promise<User> {
    const user = await this.usersRepository.findByID(data.user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    let changeEmail = data.email;

    const updatedEmail = await this.usersRepository.findByEmail(changeEmail);

    if (updatedEmail && updatedEmail.id !== user.id) {
      changeEmail = user.email;
    }

    Object.assign(user, {
      ...user,
      name: data.name,
      lastname: data.lastname,
      email: changeEmail,
      birthday: data.birthday,
      phone: data.phone,
      mobile: data.mobile,
      address: data.address,
      address_number: data.address_number,
      aditional_info: data.aditional_info,
      city: data.city,
      cap: data.cap,
    });

    await this.usersRepository.save(user);
    await this.cacheProvider.invalidate('users-list');

    return classToClass(user);
  }
}

export default UpdateUserService;
