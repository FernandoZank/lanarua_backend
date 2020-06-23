import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import UpdatePasswordService from '@modules/users/services/UpdatePasswordService';

export default class ResetPasswordController {
  async create(request: Request, response: Response): Promise<Response> {
    const { password, password_confirmation, token } = request.body;

    const resetPass = container.resolve(ResetPasswordService);

    await resetPass.execute({ password, password_confirmation, token });

    return response.status(204).json();
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { old_password, new_password, password_confirmation } = request.body;

    const updatePass = container.resolve(UpdatePasswordService);

    const transaction = await updatePass.execute({
      user_id: id,
      old_password,
      new_password,
      password_confirmation,
    });

    return response.status(204).json();
  }
}
