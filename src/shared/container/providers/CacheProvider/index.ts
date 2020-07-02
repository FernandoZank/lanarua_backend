import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';

import Redis from './implementations/RedisCacheProvider';

const providers = {
  redis: Redis,
};

container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
