# echoing app

this is for getting started with dapr monorepo onboarding.

## development mode

```sh
yarn install --frozen-lockfile
yarn dev
# or
docker compose -f docker-compose.dev.yaml up -d
```

## production mode
```bash
yarn install --frozen-lockfile
yarn build
yarn start
```
