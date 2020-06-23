import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { isAfter, addHours } from 'date-fns';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

@injectable()
class ForgotPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('Token does not exists', 404);
    }

    const user = await this.usersRepository.findByID(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);
    const dateNOW = new Date(Date.now());

    if (isAfter(dateNOW, compareDate)) {
      await this.userTokensRepository.delete(userToken.id);
      throw new AppError('Token expired', 422);
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
    await this.userTokensRepository.delete(userToken.id);
  }
}

export default ForgotPasswordService;
