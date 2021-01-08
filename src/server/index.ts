import express from 'express'
import path from 'path'

import config from './config'

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

app.get('/api/hello', (_req, res) => res.send('Hello World'))

app.listen(port, () => console.log(`Listening on port ${port}`))
