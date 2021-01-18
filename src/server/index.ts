import path from 'path'

import express, { Request, Response } from 'express'
import session from 'express-session'
import SequelizeStoreFactory from 'connect-session-sequelize'
import bodyParser from 'body-parser'
import { Sequelize } from 'sequelize'

import minimatch from 'minimatch'
import { totp as totpFactory } from 'otplib'

import config from './config'
import api from './api'
import { addModelsTo } from './models'
import { CheckerController, CheckerService } from './checker'
import { AuthController, AuthService } from './auth'

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

const checker = new CheckerController({
  service: new CheckerService({
    Checker,
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
const port = config.get('port')

app.use(express.static(path.resolve(__dirname + '/../../build/client')))
app.use(express.static(path.resolve(__dirname + '/../../public')))

// Facilitate deep-linking
const sendIndex = (_req: Request, res: Response) =>
  res.sendFile(path.resolve(__dirname + '/../../build/client/index.html'))

app.get('/c/:id', sendIndex)
app.get('/debug', sendIndex)
app.get('/login', sendIndex)
app.get('/projects', sendIndex)

const apiMiddleware = [sessionMiddleware, bodyParser.json()]
app.use('/api/v1', apiMiddleware, api({ checker, auth }))

sequelize
  .sync()
  .then(() => app.listen(port, () => console.log(`Listening on port ${port}`)))
