# Chainlonk: External Adapter for QA/Testing purposes

This external adapter does not actually query any data source but instead takes a random walk every 5 minutes.
It takes commands through a basic REST API to set specific values.
You can use this to test that contracts or alerts behave as expected in a realistic environment.

# REST API

## POST `/pair`

Registers a pair for querying like a real EA

Params:

- `from`: The base currency to create
- `to`: The currency to convert to
- `maxDeviation`: The max number to deviate by during the random walk (optional, defaults to 5%)
- `currentPrice`: Set the current price for the pair (optional, defaults to 100)

Returns 201 when created
Returns 422 when already exists

## PUT `/pair/<from>-<to>/`

Update EA params

- `maxDeviation`: The max number to deviate by during the random walk (optional)
- `currentPrice`: Set the current price for the pair (optional)

Returns 200 on success
Returns 422 on any validation errors

## DELETE `/pair/<from>-<to>/`

Unregisters a given pair.

Returns 200 on success
Returns 404 if you try to delete a non existent pair

## GET `/`

List all actively registered pairs.

## POST`/`

Params:

- `base`, `from`, or `coin`: The symbol of the currency to query
- `quote`, `to`, or `market`: The symbol of the currency to convert to

Returns 200 if the pair is known
Returns 404 for unknown/unregistered pairs

# Up and running

- Run redis:

```bash
docker run -p 6379:6379 --name ea-redis -d redis redis-server
```

- Build and run the EA locally (see README in the root of this project)

- Set a pair up

```bash
curl -H 'Content-Type: application/json' -d '{"from":"LONK", "to":"USD"}' localhost:8080/pairs
```

- Query the EA

```bash
curl -H 'Content-Type: application/json' -d '{"from":"LONK", "to":"USD"}' localhost:8080/
```

- Set a specific price

```bash
curl -H 'Content-Type: application/json' -X PUT -d '{"currentPrice":666}' localhost:8080/pairs/lonk-usd/
```