import { Router } from 'express';

import emailsRoutes from '@modules/users/infra/http/routes/emails.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/auth', sessionsRoutes);
routes.use('/users', usersRoutes);
routes.use('/password', passwordRoutes);
routes.use('/email', emailsRoutes);

export default routes;
