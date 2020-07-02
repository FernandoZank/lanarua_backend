import { inject, injectable } from 'tsyringe';
import path from 'path';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import User from '../infra/typeorm/entities/User';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

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

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
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

    const hashed = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      lastname,
      email,
      password: hashed,
      birthday,
    });

    if (!user) {
      throw new AppError('Unable to create user');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const validationEmailTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'validateEmail.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Convalida e-mail',
      templateData: {
        file: validationEmailTemplate,
        variables: {
          name: user.name,
          validate: `${process.env.APP_WEB_URL}/validate?token=${token}`,
          notme: `${process.env.APP_WEB_URL}/deny?token=${token}`,
        },
      },
    });

    await this.cacheProvider.invalidate('users-list');

    return classToClass(user);
  }
}

export default CreateUserService;
