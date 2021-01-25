import path from 'path'

import express, { Express, Request, Response } from 'express'
import session from 'express-session'
import SequelizeStoreFactory from 'connect-session-sequelize'
import bodyParser from 'body-parser'
import { Sequelize } from 'sequelize'

import minimatch from 'minimatch'
import { totp as totpFactory } from 'otplib'

import config from '../config'
import api from '../api'
import { addModelsTo } from '../models'
import { CheckerController, CheckerService } from '../checker'
import { AuthController, AuthService } from '../auth'

const totp = totpFactory.clone({ step: 60 })

const mailSuffix = config.get('mailSuffix')

const emailValidator = new minimatch.Minimatch(mailSuffix, {
  noext: true,
  noglobstar: true,
  nobrace: true,
  nonegate: true,
})

const sequelize = new Sequelize({ dialect: 'sqlite' })

const { Checker, User } = addModelsTo(sequelize, { emailValidator })

export async function bootstrap(): Promise<Express> {
  const checker = new CheckerController({
    service: new CheckerService({
      sequelize,
      Checker,
      User,
    }),
  })

  const auth = new AuthController({
    service: new AuthService({
      secret: config.get('otpSecret'),
      emailValidator,
      totp,
      mailer: (options, callback) => {
        console.log(options)
        callback(null, options)
      },
      User,
    }),
  })

  const SequelizeStore = SequelizeStoreFactory(session.Store)

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
      secure: config.get('nodeEnv') === 'production',
      maxAge: config.get('cookieMaxAge'),
    },
    secret: config.get('sessionSecret'),
    name: 'checkfirst',
  })

  const app = express()

  app.use(express.static(path.resolve(__dirname + '/../../build/client')))
  app.use(express.static(path.resolve(__dirname + '/../../public')))

  const apiMiddleware = [sessionMiddleware, bodyParser.json()]
  app.use('/api/v1', apiMiddleware, api({ checker, auth }))

  // Facilitate deep-linking
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname + '/../../build/client/index.html'))
  })

  await sequelize.sync()
  return app
}

export default bootstrap
