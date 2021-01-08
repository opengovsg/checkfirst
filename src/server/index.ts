import path from 'path'

import express from 'express'
import bodyParser from 'body-parser'

import config from './config'
import api from './api'
import CheckerController from './checker'

const checker = new CheckerController()

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

app.listen(port, () => console.log(`Listening on port ${port}`))
