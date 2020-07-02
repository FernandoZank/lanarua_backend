import { inject, injectable } from 'tsyringe';
import path from 'path';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import mailConfig from '@config/mail';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
class ResendVerificationEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(user_id: string): Promise<void> {
    const user = await this.usersRepository.findByID(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const resendActivationMailTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'resendEmail.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Verificazione di email',
      templateData: {
        file: resendActivationMailTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/validate?token=${token}`,
        },
      },
    });
  }
}

export default ResendVerificationEmailService;
