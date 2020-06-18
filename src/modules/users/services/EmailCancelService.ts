import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { isAfter, addDays } from 'date-fns';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
class EmailCancelService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute(token: string): Promise<void> {
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

    await this.usersRepository.deleteUser(user.id);
  }
}

export default EmailCancelService;
