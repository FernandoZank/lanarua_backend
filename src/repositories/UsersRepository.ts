import { EntityRepository, Repository } from 'typeorm';
// import { isAfter } from 'date-fns';
import User from '../models/User';

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  public async findBirthdays(): Promise<User[] | null> {
    const allUsers = await this.find();

    const users = allUsers.filter(user => {
      // const year = new Date().getFullYear();
      const today = new Date(2020, 0, 1, 0, 0);
      const birthday = new Date(user.birthday);
      if (
        today.getMonth() === birthday.getMonth() &&
        today.getDay() >= birthday.getDay()
      ) {
        return user;
      }

      return null;
    });

    return users || null;
  }
}

export default UsersRepository;
