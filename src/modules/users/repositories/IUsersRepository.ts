import User from '../infra/typeorm/entities/User';

import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  returnAll(): Promise<User[]>;
  findByID(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
