import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { isAfter, addDays } from 'date-fns';

import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { classToClass } from 'class-transformer';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import User from '../infra/typeorm/entities/User';

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class EmailValidationService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute(token: string): Promise<IResponse> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token does not exists', 404);
    }

    const user = await this.usersRepository.findByID(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists', 404);
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addDays(tokenCreatedAt, 1);
    const date = new Date(Date.now());

    if (isAfter(date, compareDate)) {
      await this.userTokensRepository.delete(userToken.id);
      throw new AppError('Token expired');
    }

    user.email_verification = true;

    await this.usersRepository.save(user);

    await this.userTokensRepository.delete(userToken.id);

    const { secret, expiresIn } = authConfig.jwt;
    const newToken = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user: classToClass(user),
      token: newToken,
    };
  }
}

export default EmailValidationService;
