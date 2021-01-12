import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import { Sequelize } from 'sequelize'

import config from './config'
import api from './api'
import { addModelsTo } from './models'
import { CheckerController, CheckerService } from './checker'

const sequelize = new Sequelize({ dialect: 'sqlite' })

const { Checker } = addModelsTo(sequelize)

const checker = new CheckerController({
  service: new CheckerService({
    Checker,
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
app.use('/api/v1', apiMiddleware, api({ checker }))

sequelize
  .sync()
  .then(() => app.listen(port, () => console.log(`Listening on port ${port}`)))
