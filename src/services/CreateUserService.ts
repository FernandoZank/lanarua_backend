import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import AppError from '../errors/AppError';

import UsersRepository from '../repositories/UsersRepository';

interface IRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
  birthday: Date;
}

class CreateUserService {
  public async execute({
    name,
    lastname,
    email,
    password,
    birthday,
  }: IRequest): Promise<User> {
    const userRepo = getCustomRepository(UsersRepository);

    const userExists = await userRepo.findOne({ where: { email } });

    if (userExists) {
      throw new AppError('Email address already in use');
    }

    const hashed = await hash(password, 8);

    const user = userRepo.create({
      name,
      lastname,
      email,
      password: hashed,
      birthday,
    });

    await userRepo.save(user);

    delete user.password;
    return user;
  }
}

export default CreateUserService;
