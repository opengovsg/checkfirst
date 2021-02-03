import path from 'path'

import express, { Express, Request, Response } from 'express'
import session from 'express-session'
import SequelizeStoreFactory from 'connect-session-sequelize'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import minimatch from 'minimatch'
import { totp as totpFactory } from 'otplib'

import config from '../config'
import api from '../api'
import { addModelsTo } from '../models'
import { CheckerController, CheckerService } from '../checker'
import { AuthController, AuthService } from '../auth'
import { ip } from '../utils/express'

import sequelize from './sequelize'
import mailer from './mailer'
import logger from './logger'

// Define our own tokens
morgan.token('client-ip', (req: express.Request) => ip(req) as string)
morgan.token(
  'userId',
  (req: express.Request) => `${req.session?.user?.id || '-'}`
)

const MORGAN_LOG_FORMAT =
  ':client-ip - [:date[clf]] ":method :url HTTP/:http-version" :status ' +
  '":userId" :res[content-length] ":referrer" ":user-agent" :response-time ms'

const totp = totpFactory.clone({ step: 30, window: [1, 0] })

const mailSuffix = config.get('mailSuffix')

const emailValidator = new minimatch.Minimatch(mailSuffix, {
  noext: true,
  noglobstar: true,
  nobrace: true,
  nonegate: true,
})

const { Checker, User } = addModelsTo(sequelize, { emailValidator })

export async function bootstrap(): Promise<Express> {
  const checker = new CheckerController({
    service: new CheckerService({
      logger,
      sequelize,
      Checker,
      User,
    }),
  })

  const auth = new AuthController({
    logger,
    service: new AuthService({
      secret: config.get('otpSecret'),
      emailValidator,
      totp,
      mailer,
      User,
      logger,
    }),
  })

  const SequelizeStore = SequelizeStoreFactory(session.Store)

  const secure = ['production', 'staging'].includes(config.get('nodeEnv'))

  const sessionMiddleware = session({
    store: new SequelizeStore({
      db: sequelize,
      tableName: 'sessions',
    }),
    resave: false, // can set to false since touch is implemented by our store
    saveUninitialized: false, // do not save new sessions that have not been modified
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure,
      maxAge: config.get('cookieMaxAge'),
    },
    secret: config.get('sessionSecret'),
    name: 'checkfirst',
  })

  const app = express()

  if (secure) {
    app.set('trust proxy', 1)
  }

  app.use(express.static(path.resolve(__dirname + '/../../../build/client')))
  app.use(express.static(path.resolve(__dirname + '/../../../public')))

  app.use(morgan(MORGAN_LOG_FORMAT))

  const apiMiddleware = [sessionMiddleware, bodyParser.json()]
  app.use('/api/v1', apiMiddleware, api({ checker, auth }))

  // Facilitate deep-linking
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname + '/../../../build/client/index.html'))
  })

  await sequelize.sync()
  return app
}

export { logger } from './logger'
export default bootstrap
