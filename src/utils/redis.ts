import { createClient, RedisClient } from "redis";

export const redisConnection: RedisClient = createClient();
