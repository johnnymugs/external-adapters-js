# Chainlonk: An External Adapter for QA/Testing purposes

This external adapter's output is set via a REST API.
You can use this to test that contracts or alerts behave as expected in a test or deployed environment.

# REST API

## POST `/pair`

Registers a currency pair for querying

Params:

- `from`: The base currency to create
- `to`: The currency to convert to
- `currentPrice`: Set the current price for the pair (optional, defaults to 100)

```bash
curl -H 'Content-Type: application/json' -d '{"from":"LONK", "to":"USD", "currentPrice":666}' localhost:8080/pairs
```

Returns 201 when created
Returns 422 when already exists

## PUT `/pair/<from>-<to>/`

Update pair attributes

- `currentPrice`: Set the current price for the pair (optional)

```bash
curl -H 'Content-Type: application/json' -X PUT -d '{"currentPrice":666}' localhost:8080/pairs/lonk-usd/
```

Returns 200 on success
Returns 404 for a non-existent pair
Returns 422 on any validation errors

## DELETE `/pair/<from>-<to>/`

Unregisters a given pair.

```bash
curl -H 'Content-Type: application/json' -X DELETE localhost:8080/pairs/lonk-usd/
```

Returns 200 on success
Returns 404 if you try to delete a non-existent pair

## GET `/`

List all actively registered pairs.

```bash
curl -H 'Content-Type: application/json' localhost:8080/
```

## POST`/`

Get the current price for a currency pair (default External Adapter behavior)

Params:

- `base`, `from`, or `coin`: The symbol of the currency to query
- `quote`, `to`, or `market`: The symbol of the currency to convert to

```bash
curl -H 'Content-Type: application/json' -X POST -d '{"from":"LONK", "to":"USD"}' localhost:8080/
```

Returns 200 if the pair is known
Returns 404 for unknown/unregistered pairs

# Up and running in development

- Run redis:

```bash
docker run -p 6379:6379 --name ea-redis -d redis redis-server --requirepass imlonkfrompennsylvania
```

- Build and run the EA locally (see README in the root of this project, don't forget the redis password!)

```bash
make docker adapter=chainlonk
docker run -p 8080:8080 -e CACHE_REDIS_PASSWORD='imlonkfrompennsylvania' -it chainlonk-adapter:latest
```
