import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IUsersRepository from '../repositories/IUsersRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  user_id: string;
  old_password: string;
  new_password: string;
}

@injectable()
class UpdatePasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    old_password,
    new_password,
  }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const passMatch = await this.hashProvider.compareHash(
      old_password,
      user.password,
    );

    if (!passMatch) {
      throw new AppError('Wrong password', 403);
    }

    user.password = await this.hashProvider.generateHash(new_password);

    await this.usersRepository.save(user);
  }
}

export default UpdatePasswordService;
