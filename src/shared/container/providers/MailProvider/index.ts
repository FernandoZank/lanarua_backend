import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailProvider from './models/IMailProvider';

import Ethereal from './implementations/EtherealMailProvider';
import SES from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(Ethereal),
  ses: container.resolve(SES),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
