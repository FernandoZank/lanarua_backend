import { Router } from 'express';

import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import usersRoutes from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use('/auth', sessionsRoutes);
routes.use('/users', usersRoutes);

export default routes;
