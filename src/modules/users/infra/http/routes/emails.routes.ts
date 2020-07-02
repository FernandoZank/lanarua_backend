import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuth from '@shared/infra/http/middlewares/ensureAuth';
import EmailValidateController from '../controllers/EmailValidateController';

const emailRouter = Router();

const emailValidateController = new EmailValidateController();

emailRouter.patch(
  '/validate',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
    },
  }),
  emailValidateController.update,
);

emailRouter.patch(
  '/deny',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
    },
  }),
  emailValidateController.delete,
);

emailRouter.post('/resend', ensureAuth, emailValidateController.create);

export default emailRouter;
