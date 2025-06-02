# CheckFirst

Don't Know? CheckFirst. A tool to build eligibility checkers and calculators for Singapore Government policies

## Quick Start

```
git clone git@github.com:opengovsg/checkfirst
cd checkfirst
npm ci
npm run dev
```

## Codebase Orientation - Server

### Environment Variables

As defined in `src/server/config`

### Entrypoints
- `src/server/index.ts` for Express.js
- `src/server/serverless/{api, static}.ts` for deployments into API Gateway + AWS Lambda

### Modules
- `api/` - API routing to authentication, CRUD operations
- `auth/` - Authentication layer
- `bootstrap/` - Factory function to build the Express.js application for the backend
- `checker/` - CRUD operations layer to manage checkers created by the user
- `models/` - Sequelize models
- `utils/` - miscellaneous functions

## Codebase Orientation - Client

### Entrypoint
- `src/client/index.tsx` - mounts `src/client/App.tsx` onto document


## Possible Issues with Running Code + Solutions

### Connection with postgres database

By default SQLite DB is used. For other available environments refer to: `src/server/database/config/config.ts` or edit the dialect for development environment to `postgres`

### SQLite table not found
This may occur if the SQlite tables created is in the wrong format or required tables are not created

Add `await sequelize.sync({ force:true })` to the `src/server/bootstrap/index` file after `await sequelize.authenticate()`. This will force all the tables in to be dropped and created again with the correct tables.

A potential long term fix for issues related to SQLite is to replace SQLite with a docker-compose environment for usage during development.

## Performing Migrations
This section explains the steps required to perform remote database schema migrations using a bastion SSH instance.

- Ensure that your current IP address has been whitelisted in the bastion instance security group on AWS
- Set up a local port-forwarding service by running the following in a terminal window: `ssh -L 5433:<DB_HOST>:5432 <SSH_TUNNEL_USER>@<SSH_TUNNEL_HOST> -i <PATH_TO_SSH_HOST_PEM_FILE>`
- Set your `NODE_ENV` environment variable to either `staging` or `production`
- Set your `DATABASE_URL` environment variable to the following `postgres://<DB_USER>:<DB_PASS>@127.0.0.1:5433/<DB_NAME>`
- Ensure that the env vars are loaded correctly
- Perform the up-migration by running the following in another terminal window: `npx sequelize db:migrate`; perform the down-migration by running `npx sequelize db:migrate:undo`
- Verify that your migrations were completed correctly by checking that the name of the migration exists in the `SequelizeMeta` table in the database
