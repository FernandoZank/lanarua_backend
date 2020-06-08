import { getCustomRepository } from 'typeorm';
import UsersRepository from '../repositories/UsersRepository';
import User from '../models/User';

class ListMonthBirthdaysService {
  public async execute(): Promise<User[] | null> {
    const userRepo = getCustomRepository(UsersRepository);

    const users = await userRepo.find();

    const birthdays = users.filter(user => {
      const today = new Date();
      const birthday = new Date(user.birthday);

      if (
        today.getMonth() === birthday.getMonth() &&
        today.getDate() <= birthday.getDate()
      ) {
        return user;
      }
      return null;
    });

    return birthdays;
  }
}

export default ListMonthBirthdaysService;
