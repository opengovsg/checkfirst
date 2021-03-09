import express from 'express'
import serverless, { Handler } from 'serverless-http'

import morgan from '../bootstrap/morgan'
import addStaticRoutes from '../bootstrap/static'
import helmet from '../bootstrap/helmet'

const BINARY_CONTENT_TYPES = ['image/png']

const app = express()
app.use(morgan)
app.use(helmet)
addStaticRoutes(app)

export const handler: Handler = serverless(app, {
  binary: BINARY_CONTENT_TYPES,
})
