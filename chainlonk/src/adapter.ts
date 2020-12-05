import { Execute } from '@chainlink/types'
const { logger } = require('@chainlink/external-adapter')
import { Requester, Validator } from '@chainlink/external-adapter'

const customError = (data: any) => data.Response === 'Error'

const customParams = {
  base: ['base', 'from', 'coin'],
  quote: ['quote', 'to', 'market'],
  endpoint: false,
}

export const execute: Execute = async (input) => {
  const validator = new Validator(input, customParams)
  if (validator.error) throw validator.error
  logger.info("Got here")

  const jobRunID = validator.validated.id
  const base = validator.validated.data.base.toUpperCase()
  const quote = validator.validated.data.quote.toUpperCase()
  logger.info("Got all my consts")

  const response: any = { data: { result: 666.00 }, status: 200 }
  return Requester.success(jobRunID, response)
}
