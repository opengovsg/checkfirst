import express, { Router } from 'express'
import CheckerController from '../checker'

export default (options: { checker: CheckerController }): Router => {
  const { checker } = options
  const api = express.Router()

  // CRUD for checker template
  api.post('/c', checker.post)
  api.get('/c/:id', checker.get)
  api.put('/c/:id', checker.put)
  api.delete('/c/:id', checker.delete)

  return api
}
