import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserTypeService from '@modules/users/services/UpdateUserTypeService';

import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';

export default class UserTypeController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateType = container.resolve(UpdateUserTypeService);

    const { admin } = request.user;
    const { user_id, user_type } = request.body;

    const user = await updateType.execute({ user_id, user_type, admin });

    return response.json(classToClass(user));
  }
}
