import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import CreateUserService from '../services/CreateUserService';
import ListUserService from '../services/ListUserService';
import ListMonthBirthdaysService from '../services/ListMonthBirthdaysService';
import ensureAuth from '../middlewares/ensureAuth';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import AppError from '../errors/AppError';

const usersRouter = Router();
const upload = multer(uploadConfig);

// usersRouter.get('/', ensureAuth, async (request, response) => { O ENSUREAUTH será o middleware que bloqueia ou não o usuário
usersRouter.get('/', ensureAuth, async (request, response) => {
  const searchUser = new ListUserService();

  const users = await searchUser.execute();

  return response.json(users);
});

usersRouter.patch(
  '/avatar',
  ensureAuth,
  upload.single('avatar'),
  async (request, response) => {
    const type = request.file.mimetype.substr(0, 5);

    if (type === 'image') {
      const updateAvatar = new UpdateUserAvatarService();

      const user = await updateAvatar.execute({
        user_id: request.user.id,
        filename: request.file.filename,
      });

      return response.json(user);
    }

    const file = path.join(uploadConfig.directory, request.file.filename);
    await fs.promises.unlink(file);

    throw new AppError('Mimetype does not match the accepted formats.', 422);
  },
);

usersRouter.post('/', async (request, response) => {
  const { name, lastname, email, password, birthday } = request.body;
  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    lastname,
    email,
    password,
    birthday,
  });
  return response.json(user);
});

usersRouter.get('/birthdays', ensureAuth, async (request, response) => {
  const searchBirthdays = new ListMonthBirthdaysService();

  const birthdays = await searchBirthdays.execute();

  return response.json(birthdays);
});

export default usersRouter;
