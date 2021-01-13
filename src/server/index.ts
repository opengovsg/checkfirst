import path from 'path'

import express from 'express'
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

const app = express()
const port = config.get('port')

app.use(express.static(path.resolve(__dirname + '/../../build/client')))
app.use(express.static(path.resolve(__dirname + '/../../public')))

// Facilitate deep-linking
app.get('/c/:id', (_req, res) =>
  res.sendFile(path.resolve(__dirname + '/../../build/client/index.html'))
)

app.get('/debug', (_req, res) =>
  res.sendFile(path.resolve(__dirname + '/../../build/client/index.html'))
)

const apiMiddleware = [bodyParser.json()]
app.use('/api/v1', apiMiddleware, api({ checker, auth }))

sequelize
  .sync()
  .then(() => app.listen(port, () => console.log(`Listening on port ${port}`)))
