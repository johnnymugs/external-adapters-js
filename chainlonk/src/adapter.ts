import { Execute } from '@chainlink/types'
const { logger } = require('@chainlink/external-adapter')
import { Requester, Validator } from '@chainlink/external-adapter'
import { RedisCache, defaultOptions as defaultRedisOptions } from '@chainlink/ea-bootstrap/lib/cache/redis'

const customError = (data: any) => data.Response === 'Error'

const customParams = {
  base: ['base', 'from', 'coin'],
  quote: ['quote', 'to', 'market'],
  endpoint: false,
}

export const execute: Execute = async (input) => {
  const validator = new Validator(input, customParams)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const base = validator.validated.data.base.toUpperCase()
  const quote = validator.validated.data.quote.toUpperCase()

  try {

  // see if we can connect to rediS
  const redis = new RedisCache(defaultRedisOptions())
  await redis.connect()
  await redis.set("updog", "test666", 1000000)
  const got = await redis.get("updog")
  logger.info(`>>>>>>>>>>>REDIS GOT ${got}`)

  } catch (e) {
    logger.info(`FUCK: ${e}`)
  }

  const response: any = { data: { result: 666.00 }, status: 200 }
  return Requester.success(jobRunID, response)
}
