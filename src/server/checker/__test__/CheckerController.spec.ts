import request from 'supertest'
import { CheckerController } from '..'
import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'

describe('CheckerController', () => {
  const sessionMiddleware = (session: Record<string, unknown>) => (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    Object.assign(req, { session })
    next()
  }

  const service = {
    create: jest.fn(),
    list: jest.fn(),
    retrieve: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
  const controller = new CheckerController({ service })

  describe('post', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.post('/c', controller.post)

    beforeEach(() => {
      service.create.mockReset()
    })

    it('rejects non-authenticated creation', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.post('/c', controller.post)
      await request(app)
        .post('/c')
        .send({ id: 'id', title: 'title' })
        .expect(401)
    })

    it('allows authenticated creation', async () => {
      const checker = { id: 'id', title: 'title' }
      service.create.mockResolvedValue(true)
      const response = await request(app).post('/c').send(checker).expect(200)
      expect(response.body).toStrictEqual(checker)
      expect(service.create).toHaveBeenCalledWith(checker, user)
    })

    it('rejects creation of duplicate id', async () => {
      const checker = { id: 'id', title: 'title' }
      service.create.mockResolvedValue(false)
      const response = await request(app).post('/c').send(checker).expect(422)
      expect(response.body).toMatchObject({ message: expect.any(String) })
      expect(service.create).toHaveBeenCalledWith(checker, user)
    })

    it('returns error on service exception', async () => {
      const message = 'An error message'
      const checker = { id: 'id', title: 'title' }
      service.create.mockRejectedValue(new Error(message))
      const response = await request(app).post('/c').send(checker).expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.create).toHaveBeenCalledWith(checker, user)
    })
  })
})
