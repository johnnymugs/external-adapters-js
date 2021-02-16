import { defaultCacheOptions } from '@chainlink/ea-bootstrap'
import { logger } from '@chainlink/external-adapter'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import json from 'koa-json'
import Router from 'koa-router'

const port = process.env.EA_PORT || 8080
const uniqueKey = process.env.UNIQUE_KEY || "lonkfrompennsylvania"

const app = new Koa()
const router = new Router()

const memstore: any = {}

const options = defaultCacheOptions()
var cache: any
console.log(cache)

export const server = () => {
  router.post('/pairs', async (ctx, next) => {
    const from = ctx.request.body.from
    const to = ctx.request.body.to
    const currentPrice = ctx.request.body.currentPrice || 100
    const id = getId(from, to)

    if (!(from && to)) {
      ctx.throw('`from` and `to` fields are required', 422)
    }

    cache.set(getCacheKey(id), currentPrice)
    ctx.body = { currentPrice: currentPrice }

    await next()
  })

  router.put('/pairs/:id', async (ctx, next) => {
    const id = ctx.params.id.toUpperCase()
    const currentPrice = ctx.request.body.currentPrice
    const cacheKey = getCacheKey(id)

    if (!currentPrice) {
      ctx.throw('Field `currentPrice` is required', 422)
    }

    
    if (!cache.get(cacheKey)) {
      ctx.throw(`${id} not found`, 404)
    }

    cache.set(cacheKey, currentPrice)
    ctx.body = { currentPrice: currentPrice }

    await next()
  })

  router.delete('/pairs/:id', async (ctx, next) => {
    const id = ctx.params.id.toUpperCase()
    const cacheKey = getCacheKey(id)

    if (!cache.get(cacheKey)) {
      ctx.throw('Not found', 404)
    }

    cache.set(cacheKey, undefined) // TODO: ???

    await next()
  })

  router.post('/', async (ctx, next) => {
    // "Default" behavior
    const from = ctx.request.body.base || ctx.request.body.from || ctx.request.body.coin
    const to = ctx.request.body.quote || ctx.request.body.to || ctx.request.body.market

    const id = getId(from, to)
    const cacheKey = getCacheKey(id)

    if (!(to && from)) {
      ctx.throw('`from` and `to` fields are required', 422)
    }

    const result = cache.get(cacheKey)

    if (!result) {
      ctx.throw(`Not found`, 404)
    }

    ctx.body = { result: result }

    await next()
  })

  router.get('/', async (ctx, next) => {
    // list all pairs
    ctx.body = { msg: 'TODO' }
    await next()
  })

  router.get('/health', async (ctx, next) => {
    ctx.body = { msg: 'Looking hale and hearty' }
    await next()
  })

  app.use(debugLogger)
  app.use(json())
  app.use(bodyParser())
  app.use(initRedis)
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(port, () => {
    logger.info(`Chainlonk adapter listening on port ${port}`)
  })
}

const getId = (from: string, to: string): string => {
  return `${from}-${to}`.toUpperCase()
}

const getCacheKey = (id: string): string => {
  return `chainlonk${uniqueKey}-${id}`
}

const debugLogger = async (
  ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, unknown>>,
  next: Koa.Next,
) => {
  logger.debug(`Received request ${ctx.method} ${ctx.url}`)
  await next()
}

const initRedis = async (
  ctx: Koa.ParameterizedContext<any, Router.IRouterParamContext<any, unknown>>,
  next: Koa.Next,
) => {
  if (!cache) {
    cache = await options.cacheBuilder(options.cacheOptions)
  }

  await next()
}
