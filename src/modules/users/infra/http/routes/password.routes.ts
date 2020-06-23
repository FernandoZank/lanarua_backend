import { Router } from 'express';
import ensureAuth from '@shared/infra/http/middlewares/ensureAuth';
import { celebrate, Segments, Joi } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();

const forgotPassController = new ForgotPasswordController();
const resetPassController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPassController.create,
);

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPassController.create,
);
passwordRouter.patch(
  '/update',
  celebrate({
    [Segments.BODY]: {
      old_password: Joi.string().required(),
      new_password: Joi.string().required(),
      password_confirmation: Joi.string()
        .required()
        .valid(Joi.ref('new_password')),
    },
  }),
  ensureAuth,
  resetPassController.update,
);

export default passwordRouter;
