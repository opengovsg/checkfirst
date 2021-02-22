import request from 'supertest'
import { omit } from 'lodash'
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

  const checker = {
    id: 'id',
    title: 'title',
    fields: [],
    constants: [],
    displays: [],
    operations: [],
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
      service.create.mockResolvedValue(true)
      const response = await request(app).post('/c').send(checker).expect(200)
      expect(response.body).toStrictEqual(checker)
      expect(service.create).toHaveBeenCalledWith(checker, user)
    })

    it('rejects creation of duplicate id', async () => {
      service.create.mockResolvedValue(false)
      const response = await request(app).post('/c').send(checker).expect(422)
      expect(response.body).toMatchObject({ message: expect.any(String) })
      expect(service.create).toHaveBeenCalledWith(checker, user)
    })

    it('returns error on service exception', async () => {
      const message = 'An error message'
      service.create.mockRejectedValue(new Error(message))
      const response = await request(app).post('/c').send(checker).expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.create).toHaveBeenCalledWith(checker, user)
    })

    it('returns error when checker is invalid', async () => {
      service.create.mockResolvedValue(true)
      const invalid = omit(checker, 'title')
      const response = await request(app).post('/c').send(invalid).expect(400)
      expect(response.body).toMatchObject({
        message: expect.stringMatching(/(required)/),
      })
      expect(service.create).not.toHaveBeenCalled()
    })
  })

  describe('list', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.get('/c', controller.list)

    beforeEach(() => {
      service.list.mockReset()
    })

    it('rejects non-authenticated listing', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.get('/c', controller.list)
      await request(app).get('/c').expect(401)
    })

    it('allows authenticated listing', async () => {
      service.list.mockResolvedValue([checker])
      const response = await request(app).get('/c').expect(200)
      expect(response.body).toStrictEqual([checker])
      expect(service.list).toHaveBeenCalledWith(user)
    })

    it('returns error on listing exception', async () => {
      const message = 'An error message'
      service.list.mockRejectedValue(new Error(message))
      const response = await request(app).get('/c').expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.list).toHaveBeenCalledWith(user)
    })
  })

  describe('get', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.get('/c/:id', controller.get)

    beforeEach(() => {
      service.retrieve.mockReset()
    })

    it('accepts non-authenticated get', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.get('/c/:id', controller.get)

      service.retrieve.mockResolvedValue(checker)
      const response = await request(app).get(`/c/${checker.id}`).expect(200)
      expect(response.body).toStrictEqual(checker)
      expect(service.retrieve).toHaveBeenCalledWith(checker.id, undefined)
    })

    it('allows authenticated get', async () => {
      service.retrieve.mockResolvedValue(checker)
      const response = await request(app).get(`/c/${checker.id}`).expect(200)
      expect(response.body).toStrictEqual(checker)
      expect(service.retrieve).toHaveBeenCalledWith(checker.id, user)
    })

    it('returns 404 on Not Found', async () => {
      const id = 'missing'
      service.retrieve.mockResolvedValue(undefined)
      await request(app).get(`/c/${id}`).expect(404)
      expect(service.retrieve).toHaveBeenCalledWith(id, user)
    })

    it('returns error on get exception', async () => {
      const id = 'bad'
      const message = 'An error message'
      service.retrieve.mockRejectedValue(new Error(message))
      const response = await request(app).get(`/c/${id}`).expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.retrieve).toHaveBeenCalledWith(id, user)
    })
  })

  describe('put', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.put('/c/:id', controller.put)

    beforeEach(() => {
      service.update.mockReset()
    })

    it('rejects non-authenticated put', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.put('/c/:id', controller.put)

      service.update.mockResolvedValue(1)

      await request(app).put(`/c/${checker.id}`).send(checker).expect(401)
      expect(service.update).not.toHaveBeenCalled()
    })

    it('accepts authenticated put', async () => {
      service.update.mockResolvedValue(checker)
      const response = await request(app)
        .put(`/c/${checker.id}`)
        .send(checker)
        .expect(200)
      expect(response.body).toStrictEqual(checker)
      expect(service.update).toHaveBeenCalledWith(checker.id, checker, user)
    })

    it('returns 404 on put Not Found', async () => {
      service.update.mockResolvedValue(0)
      await request(app).put(`/c/${checker.id}`).send(checker).expect(404)
      expect(service.update).toHaveBeenCalledWith(checker.id, checker, user)
    })

    it('returns error on put exception', async () => {
      const message = 'An error message'
      service.update.mockRejectedValue(new Error(message))
      const response = await request(app)
        .put(`/c/${checker.id}`)
        .send(checker)
        .expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.update).toHaveBeenCalledWith(checker.id, checker, user)
    })

    it('returns error when checker is invalid', async () => {
      service.create.mockResolvedValue(true)
      const invalid = omit(checker, 'title')
      const response = await request(app)
        .put(`/c/${checker.id}`)
        .send(invalid)
        .expect(400)
      expect(response.body).toMatchObject({
        message: expect.stringMatching(/(required)/),
      })
      expect(service.create).not.toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.delete('/c/:id', controller.delete)

    beforeEach(() => {
      service.delete.mockReset()
    })

    it('rejects non-authenticated delete', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.delete('/c/:id', controller.delete)

      service.delete.mockResolvedValue(1)

      await request(app).delete(`/c/${checker.id}`).send(checker).expect(401)
      expect(service.delete).not.toHaveBeenCalled()
    })

    it('accepts authenticated delete', async () => {
      service.delete.mockResolvedValue(checker)
      const response = await request(app)
        .delete(`/c/${checker.id}`)
        .send(checker)
        .expect(200)
      expect(response.body).toMatchObject({ message: expect.any(String) })
      expect(service.delete).toHaveBeenCalledWith(checker.id, user)
    })

    it('returns 404 on delete Not Found', async () => {
      service.delete.mockResolvedValue(0)
      await request(app).delete(`/c/${checker.id}`).send(checker).expect(404)
      expect(service.delete).toHaveBeenCalledWith(checker.id, user)
    })

    it('returns error on delete exception', async () => {
      const message = 'An error message'
      service.delete.mockRejectedValue(new Error(message))
      const response = await request(app)
        .delete(`/c/${checker.id}`)
        .send(checker)
        .expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.delete).toHaveBeenCalledWith(checker.id, user)
    })
  })
})
