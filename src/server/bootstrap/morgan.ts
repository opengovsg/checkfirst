import morgan from 'morgan'
import express from 'express'

import { ip } from '../utils/express'

// Define our own tokens
morgan.token('client-ip', (req: express.Request) => ip(req) as string)
morgan.token(
  'userId',
  (req: express.Request) => `${req.session?.user?.id || '-'}`
)

const MORGAN_LOG_FORMAT =
  ':client-ip - [:date[clf]] ":method :url HTTP/:http-version" :status ' +
  '":userId" :res[content-length] ":referrer" ":user-agent" :response-time ms'

export const m = morgan(MORGAN_LOG_FORMAT)

export default m
