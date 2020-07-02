import { Request, Response } from 'express';
import { container } from 'tsyringe';
import EmailValidationService from '@modules/users/services/EmailValidationService';
import EmailCancelService from '@modules/users/services/EmailCancelService';
import ResendEmailVerificationService from '@modules/users/services/ResendEmailVerificationService';

export default class EmailValidationController {
  async update(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;

    const validateEmail = container.resolve(EmailValidationService);

    const user = await validateEmail.execute(token);

    return response.json(user);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;

    const cancelUser = container.resolve(EmailCancelService);

    await cancelUser.execute(token);

    return response.status(204).json();
  }

  async create(request: Request, response: Response): Promise<Response> {
    const user = request.user.id;

    const resendEmail = container.resolve(ResendEmailVerificationService);

    await resendEmail.execute(user);

    return response.status(204).json();
  }
}
