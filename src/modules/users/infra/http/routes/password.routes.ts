import { Router } from 'express';
import ensureAuth from '@shared/infra/http/middlewares/ensureAuth';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();

const forgotPassController = new ForgotPasswordController();
const resetPassController = new ResetPasswordController();

passwordRouter.post('/forgot', forgotPassController.create);
passwordRouter.post('/reset', resetPassController.create);
passwordRouter.patch('/update', ensureAuth, resetPassController.update);

export default passwordRouter;
