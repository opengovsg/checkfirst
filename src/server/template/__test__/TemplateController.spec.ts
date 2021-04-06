import request from 'supertest'
import express, { NextFunction, Request, Response } from 'express'
import { TemplateController } from '..'
import bodyParser from 'body-parser'

describe('TemplateController', () => {
  const sessionMiddleware = (session: Record<string, unknown>) => (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    Object.assign(req, { session })
    next()
  }

  const template = {
    id: 'test-template',
    title: 'title',
    description: 'description',
    fields: [],
    constants: [],
    displays: [],
    operations: [],
  }

  const service = {
    list: jest.fn(),
    retrieve: jest.fn(),
  }
  const controller = new TemplateController({ service })

  describe('list', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.get('/template', controller.list)

    beforeEach(() => {
      service.list.mockReset()
    })

    it('rejects non-authenticated listing', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.get('/template', controller.list)
      await request(app).get('/template').expect(401)
    })

    it('allows authenticated listing', async () => {
      service.list.mockResolvedValue([template])
      const response = await request(app).get('/template').expect(200)
      expect(response.body).toStrictEqual([template])
      expect(service.list).toHaveBeenCalled()
    })
  })

  describe('get', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.get('/template/:id', controller.get)

    beforeEach(() => {
      service.retrieve.mockReset()
    })

    it('rejects non-authenticated get', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.get(`/template/${template.id}`, controller.get)
      await request(app).get(`/template/${template.id}`).expect(401)
    })

    it('allows authenticated get', async () => {
      service.retrieve.mockResolvedValue(template)
      const response = await request(app)
        .get(`/template/${template.id}`)
        .expect(200)
      expect(response.body).toStrictEqual(template)
      expect(service.retrieve).toHaveBeenCalledWith(template.id)
    })

    it('returns 404 on Not Found', async () => {
      service.retrieve.mockResolvedValue(undefined)
      await request(app).get(`/template/invalid`).expect(404)
      expect(service.retrieve).toHaveBeenCalledWith('invalid')
    })

    it('returns error on get exception', async () => {
      const message = 'An error message'
      service.retrieve.mockRejectedValue(new Error(message))
      const response = await request(app).get('/template/invalid').expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.retrieve).toHaveBeenCalledWith('invalid')
    })
  })
})
