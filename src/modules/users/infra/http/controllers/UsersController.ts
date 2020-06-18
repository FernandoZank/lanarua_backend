import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, lastname, email, password, birthday } = request.body;
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      lastname,
      email,
      password,
      birthday,
    });
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const {
      name,
      lastname,
      email,
      birthday,
      phone,
      mobile,
      address,
      address_number,
      aditional_info,
      city,
      cap,
    } = request.body;

    const { id } = request.user;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      user_id: id,
      name,
      lastname,
      email,
      birthday,
      phone,
      mobile,
      address,
      address_number,
      aditional_info,
      city,
      cap,
    });
    return response.json(user);
  }
}
