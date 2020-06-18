import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { isAfter, addDays } from 'date-fns';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import User from '../infra/typeorm/entities/User';

@injectable()
class EmailValidationService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute(token: string): Promise<User> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token does not exists');
    }

    const user = await this.usersRepository.findByID(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
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

    return user;
  }
}

export default EmailValidationService;
