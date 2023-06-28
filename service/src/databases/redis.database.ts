import Redis from 'ioredis';

export const redisDatabase = new Redis({
    host: `${process.env.REDIS_HOST}`,
    port: Number.parseInt(process.env.REDIS_PORT),
    keyPrefix: process.env.REDIS_KEY_PREFIX,
});