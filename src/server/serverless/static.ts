import express from 'express'
import serverless, { Handler } from 'serverless-http'

import morgan from '../bootstrap/morgan'
import addStaticRoutes from '../bootstrap/static'

const BINARY_CONTENT_TYPES = ['image/png']

const app = express()
app.use(morgan)
addStaticRoutes(app)

export const handler: Handler = serverless(app, {
  binary: BINARY_CONTENT_TYPES,
})
