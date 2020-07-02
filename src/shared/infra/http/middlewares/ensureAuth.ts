import { Request, Response, NextFunction } from 'express';

import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  admin: boolean;
}

export default async function ensureAuth(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  // const client = new Redis(cacheConfig.config.redis);
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Missing token.', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub, admin } = decoded as ITokenPayload;

    request.user = {
      id: sub,
      admin,
    };
    // const cached = await client.get(`@user:${request.user.id}`);

    // if (!cached) {
    //   throw new AppError('Missing token.', 401);
    // }

    // const parsedCached = JSON.parse(cached);

    // if (token !== parsedCached) {
    //   throw new AppError('Session Expired.', 401);
    // }

    return next();
  } catch (err) {
    throw new AppError('Invalid token.', err.statusCode);
  }
}
