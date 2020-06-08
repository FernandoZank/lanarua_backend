import { getCustomRepository } from 'typeorm';
import UsersRepository from '../repositories/UsersRepository';
import User from '../models/User';

class ListUserService {
  public async execute(): Promise<User[]> {
    const userRepo = getCustomRepository(UsersRepository);

    const users = await userRepo.find();

    return users;
  }
}

export default ListUserService;
