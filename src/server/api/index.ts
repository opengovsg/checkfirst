import express, { Router } from 'express'
import { AuthController } from '../auth/AuthController'
import { CheckerController } from '../checker'

export default (options: {
  checker: CheckerController
  auth: AuthController
}): Router => {
  const { checker, auth } = options
  const api = express.Router()

  // Heartbeat check
  api.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' })
  })

  // Authentication and implicit account creation
  api.post('/auth', auth.sendOTP)
  api.post('/auth/verify', auth.verifyOTP)
  api.get('/auth/whoami', auth.whoami)
  api.post('/auth/logout', auth.logout)

  // CRUD for checker template
  api.post('/c', checker.post)
  api.get('/c', checker.list)
  api.get('/c/:id', checker.get)
  api.put('/c/:id', checker.put)
  api.delete('/c/:id', checker.delete)

  return api
}
