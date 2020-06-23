import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import uploadConfig from '@config/upload';
import fs from 'fs';
import path from 'path';
import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const type = request.file.mimetype.substr(0, 5);

    if (type === 'image') {
      const updateAvatar = container.resolve(UpdateUserAvatarService);

      const user = await updateAvatar.execute({
        user_id: request.user.id,
        filename: request.file.filename,
      });

      return response.json(classToClass(user));
    }

    const file = path.join(uploadConfig.uploadsFolder, request.file.filename);
    await fs.promises.unlink(file);

    throw new AppError('Mimetype does not match the accepted formats.', 422);
  }
}
