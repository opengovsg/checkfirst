import express, { Express, Request, Response, NextFunction } from 'express'
import session from 'express-session'
import SequelizeStoreFactory from 'connect-session-sequelize'
import bodyParser from 'body-parser'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import minimatch from 'minimatch'
import { totp as totpFactory } from 'otplib'

import config from '../config'
import api from '../api'
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

export async function bootstrap(): Promise<Express> {
  const checker = new CheckerController({
    service: new CheckerService({
      logger,
      sequelize,
    }),
  })

  const auth = new AuthController({
    logger,
    service: new AuthService({
      secret: config.get('otpSecret'),
      appHost: config.get('appHost'),
      emailValidator,
      totp,
      mailer,
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

  const sentrySessionMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    if (req.session?.user) {
      const { email, id } = req.session.user
      Sentry.setUser({
        id: id.toString(),
        email: email,
      })
    }
    next()
  }

  const app = express()

  Sentry.init({
    dsn: process.env.BACKEND_SENTRY_DSN,
    // automatically picks up environment from SENTRY_ENVIRONMENT
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  })

  if (secure) {
    app.set('trust proxy', 1)
  }
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())

  app.use(morgan)
  app.use(helmet)

  const apiMiddleware = [
    sessionMiddleware,
    bodyParser.json(),
    sentrySessionMiddleware, // TODO: debug why user info isn't sent
  ]
  app.use('/api/v1', apiMiddleware, api({ checker, auth }))

  addStaticRoutes(app)

  app.use(Sentry.Handlers.errorHandler())

  await sequelize.authenticate()
  return app
}

export { logger } from './logger'
export default bootstrap
