import { container } from 'tsyringe';

import IMailTemplateProvider from './models/IMailTemplateProvider';

import Handlebars from './implementations/HandleBarsMailTemplateProvider';

const providers = {
  handlebars: Handlebars,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
