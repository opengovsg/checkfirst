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
