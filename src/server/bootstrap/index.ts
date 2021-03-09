import express, { Express } from 'express'
import session from 'express-session'
import SequelizeStoreFactory from 'connect-session-sequelize'
import bodyParser from 'body-parser'

import minimatch from 'minimatch'
import { totp as totpFactory } from 'otplib'

import config from '../config'
import api from '../api'
import { addModelsTo } from '../models'
import { CheckerController, CheckerService } from '../checker'
import { AuthController, AuthService } from '../auth'

import sequelize from './sequelize'
import mailer from './mailer'
import logger from './logger'
import morgan from './morgan'
import addStaticRoutes from './static'
import helmet from './helmet'

const step = config.get('otpExpiry') / 2

const totp = totpFactory.clone({ step, window: [1, 0] })

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

  app.use(morgan)
  app.use(helmet)

  const apiMiddleware = [sessionMiddleware, bodyParser.json()]
  app.use('/api/v1', apiMiddleware, api({ checker, auth }))

  addStaticRoutes(app)

  await sequelize.sync()
  return app
}

export { logger } from './logger'
export default bootstrap
