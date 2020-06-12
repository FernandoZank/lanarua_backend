import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
  birthday: Date;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    name,
    lastname,
    email,
    password,
    birthday,
  }: IRequest): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('Email address already in use');
    }

    const hashed = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      lastname,
      email,
      password: hashed,
      birthday,
    });

    delete user.password;
    return user;
  }
}

export default CreateUserService;
