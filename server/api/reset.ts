import { Redis } from '@upstash/redis'

export default defineEventHandler(async () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return { error: 'No Redis connection' }

  const redis = new Redis({ url, token })
  await redis.del('gitgud:games')
  return { ok: true, message: 'Cache cleared — refresh the app to re-seed' }
})