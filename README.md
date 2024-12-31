# echoing app

this is for getting started with dapr monorepo onboarding.

## diagram
![diagram](./diagram.png)

## setup
*required: copy `.env.example` on each service (under `apps` directory) and paste as `.env`

```bash
corepacke enable
yarn install --frozen-lockfile
yarn build
```

## development mode

```bash
yarn dev
```

## using dapr so you can invoke grpc

### manual
*required: you need to install dapr cli [here](https://docs.dapr.io/getting-started/install-dapr-cli/)

```bash
dapr init
# or
dapr init --slim # if you want to custom your redis, pls refer to ./components/redis.yaml file
~/.dapr/bin/placement --port 60000 # starting dapr placement

# EDIT YOUR .env for DAPR_PORT

yarn dev:dapr
```

`DAPR_PORT` for each services
- content: `DAPR_PORT=60001`
- farewell: `DAPR_PORT=60002`
- greeter: `DAPR_PORT=60003`

### using docker compose
```bash
docker compose -f docker-compose.dev.yaml up -d
# rebuild
docker compose -f docker-compose.dev.yaml up --build -d
```

## use or testing your local if running

```bash
curl -X GET http://localhost:3101
curl -X GET http://localhost:3102/content
curl -X GET http://localhost:3103/content
```

## production mode
```bash
yarn install --frozen-lockfile
yarn build
yarn start
```
