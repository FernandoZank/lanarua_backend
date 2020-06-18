import { Router } from 'express';

import EmailValidateController from '../controllers/EmailValidateController';

const emailRouter = Router();

const emailValidateController = new EmailValidateController();

emailRouter.patch('/verify', emailValidateController.update);
emailRouter.delete('/deny', emailValidateController.delete);

export default emailRouter;
