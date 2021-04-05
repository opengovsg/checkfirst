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

  api.post('/c/drafts', checker.post)
  api.get('/c/drafts', checker.list)
  api.get('/c/drafts/:id', checker.get)
  api.put('/c/drafts/:id', checker.put)
  api.delete('/c/drafts/:id', checker.delete)

  // CRUD for checker template
  api.get('/c/:id', checker.getPublished)
  api.post('/c/drafts/:id/publish', checker.publish)

  return api
}
