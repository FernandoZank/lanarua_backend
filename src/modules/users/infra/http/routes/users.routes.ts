import { Router } from 'express';
import multer from 'multer';

import { celebrate, Segments, Joi } from 'celebrate';

import uploadConfig from '@config/upload';

import UsersController from '@modules/users/infra/http/controllers/UsersController';

import ensureAuth from '@shared/infra/http/middlewares/ensureAuth';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();

const upload = multer(uploadConfig.multer);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.patch(
  '/avatar',
  ensureAuth,
  upload.single('avatar'),
  userAvatarController.update,
);

usersRouter.put(
  '/update',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email().required(),
      birthday: Joi.date().required(),
      phone: Joi.any(),
      mobile: Joi.any(),
      address: Joi.any(),
      address_number: Joi.any(),
      aditional_info: Joi.any(),
      city: Joi.any(),
      cap: Joi.any(),
    },
  }),
  ensureAuth,
  usersController.update,
);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
      birthday: Joi.date().required(),
    },
  }),
  usersController.create,
);

export default usersRouter;
