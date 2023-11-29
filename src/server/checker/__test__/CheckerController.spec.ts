import request from 'supertest'
import { omit } from 'lodash'
import { CheckerController } from '..'
import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'

describe('CheckerController', () => {
  const sessionMiddleware =
    (session: Record<string, unknown>) =>
    (req: Request, _res: Response, next: NextFunction) => {
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
    retrievePublished: jest.fn(),
    publish: jest.fn(),
    setActive: jest.fn(),
    listCollaborators: jest.fn(),
    addCollaborator: jest.fn(),
    deleteCollaborator: jest.fn(),
    findAndCheckAuth: jest.fn(),
  }
  const controller = new CheckerController({ service })

  describe('post', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.post('/c/drafts', controller.post)

    beforeEach(() => {
      service.create.mockReset()
    })

    it('rejects non-authenticated creation', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.post('/c/drafts', controller.post)
      await request(app)
        .post('/c/drafts')
        .send({ id: 'id', title: 'title' })
        .expect(401)
    })

    it('allows authenticated creation', async () => {
      service.create.mockResolvedValue(true)
      const response = await request(app)
        .post('/c/drafts')
        .send(checker)
        .expect(200)
      expect(response.body).toStrictEqual(checker)
      expect(service.create).toHaveBeenCalledWith(checker, user)
    })

    it('rejects creation of duplicate id', async () => {
      service.create.mockResolvedValue(false)
      const response = await request(app)
        .post('/c/drafts')
        .send(checker)
        .expect(422)
      expect(response.body).toMatchObject({ message: expect.any(String) })
      expect(service.create).toHaveBeenCalledWith(checker, user)
    })

    it('returns error on service exception', async () => {
      const message = 'An error message'
      service.create.mockRejectedValue(new Error(message))
      const response = await request(app)
        .post('/c/drafts')
        .send(checker)
        .expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.create).toHaveBeenCalledWith(checker, user)
    })

    it('returns error when checker is invalid', async () => {
      service.create.mockResolvedValue(true)
      const invalid = omit(checker, 'title')
      const response = await request(app)
        .post('/c/drafts')
        .send(invalid)
        .expect(400)
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
    app.get('/c/drafts', controller.list)

    beforeEach(() => {
      service.list.mockReset()
    })

    it('rejects non-authenticated listing', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.get('/c/drafts', controller.list)
      await request(app).get('/c/drafts').expect(401)
    })

    it('allows authenticated listing', async () => {
      service.list.mockResolvedValue([checker])
      const response = await request(app).get('/c/drafts').expect(200)
      expect(response.body).toStrictEqual([checker])
      expect(service.list).toHaveBeenCalledWith(user)
    })

    it('returns error on listing exception', async () => {
      const message = 'An error message'
      service.list.mockRejectedValue(new Error(message))
      const response = await request(app).get('/c/drafts').expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.list).toHaveBeenCalledWith(user)
    })
  })

  describe('get', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.get('/c/drafts/:id', controller.get)

    beforeEach(() => {
      service.retrieve.mockReset()
    })

    it('returns 401 on non-authenticated get', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.get('/c/drafts/:id', controller.get)

      service.retrieve.mockResolvedValue(checker)
      await request(app).get(`/c/drafts/${checker.id}`).expect(401)
      expect(service.retrieve).toHaveBeenCalledTimes(0)
    })

    it('allows authenticated get', async () => {
      service.retrieve.mockResolvedValue(checker)
      const response = await request(app)
        .get(`/c/drafts/${checker.id}`)
        .expect(200)
      expect(response.body).toStrictEqual(checker)
      expect(service.retrieve).toHaveBeenCalledWith(checker.id, user)
    })

    it('returns 404 on Not Found', async () => {
      const id = 'missing'
      service.retrieve.mockResolvedValue(undefined)
      await request(app).get(`/c/drafts/${id}`).expect(404)
      expect(service.retrieve).toHaveBeenCalledWith(id, user)
    })

    it('returns error on get exception', async () => {
      const id = 'bad'
      const message = 'An error message'
      service.retrieve.mockRejectedValue(new Error(message))
      const response = await request(app).get(`/c/drafts/${id}`).expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.retrieve).toHaveBeenCalledWith(id, user)
    })
  })

  describe('put', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.put('/c/drafts/:id', controller.put)

    beforeEach(() => {
      service.update.mockReset()
    })

    it('rejects non-authenticated put', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.put('/c/drafts/:id', controller.put)

      service.update.mockResolvedValue(1)

      await request(app)
        .put(`/c/drafts/${checker.id}`)
        .send(checker)
        .expect(401)
      expect(service.update).not.toHaveBeenCalled()
    })

    it('accepts authenticated put', async () => {
      service.update.mockResolvedValue(checker)
      const response = await request(app)
        .put(`/c/drafts/${checker.id}`)
        .send(checker)
        .expect(200)
      expect(response.body).toStrictEqual(checker)
      expect(service.update).toHaveBeenCalledWith(checker.id, checker, user)
    })

    it('returns 404 on put Not Found', async () => {
      service.update.mockResolvedValue(0)
      await request(app)
        .put(`/c/drafts/${checker.id}`)
        .send(checker)
        .expect(404)
      expect(service.update).toHaveBeenCalledWith(checker.id, checker, user)
    })

    it('returns error on put exception', async () => {
      const message = 'An error message'
      service.update.mockRejectedValue(new Error(message))
      const response = await request(app)
        .put(`/c/drafts/${checker.id}`)
        .send(checker)
        .expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.update).toHaveBeenCalledWith(checker.id, checker, user)
    })

    it('returns error when checker is invalid', async () => {
      service.create.mockResolvedValue(true)
      const invalid = omit(checker, 'title')
      const response = await request(app)
        .put(`/c/drafts/${checker.id}`)
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
    app.delete('/c/drafts/:id', controller.delete)

    beforeEach(() => {
      service.delete.mockReset()
    })

    it('rejects non-authenticated delete', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.delete('/c/drafts/:id', controller.delete)

      service.delete.mockResolvedValue(1)

      await request(app)
        .delete(`/c/drafts/${checker.id}`)
        .send(checker)
        .expect(401)
      expect(service.delete).not.toHaveBeenCalled()
    })

    it('accepts authenticated delete', async () => {
      service.delete.mockResolvedValue(checker)
      const response = await request(app)
        .delete(`/c/drafts/${checker.id}`)
        .send(checker)
        .expect(200)
      expect(response.body).toMatchObject({ message: expect.any(String) })
      expect(service.delete).toHaveBeenCalledWith(checker.id, user)
    })

    it('returns 404 on delete Not Found', async () => {
      service.delete.mockResolvedValue(0)
      await request(app)
        .delete(`/c/drafts/${checker.id}`)
        .send(checker)
        .expect(404)
      expect(service.delete).toHaveBeenCalledWith(checker.id, user)
    })

    it('returns error on delete exception', async () => {
      const message = 'An error message'
      service.delete.mockRejectedValue(new Error(message))
      const response = await request(app)
        .delete(`/c/drafts/${checker.id}`)
        .send(checker)
        .expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.delete).toHaveBeenCalledWith(checker.id, user)
    })
  })

  describe('getPublished', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.get('/c/:id', controller.getPublished)

    beforeEach(() => {
      service.retrievePublished.mockReset()
    })

    it('accepts non-authenticated getPublished, but returns 404 if inactive', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.get('/c/:id', controller.getPublished)

      service.retrievePublished.mockResolvedValue({
        ...checker,
        isActive: false,
      })
      await request(app).get(`/c/${checker.id}`).expect(404)
      expect(service.retrievePublished).toHaveBeenCalledWith(checker.id)
    })

    it('accepts non-authenticated getPublished, and returns 200 if active', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.get('/c/:id', controller.getPublished)

      service.retrievePublished.mockResolvedValue({
        ...checker,
        isActive: true,
      })
      const response = await request(app).get(`/c/${checker.id}`).expect(200)
      expect(response.body).toStrictEqual({ ...checker, isActive: true })
      expect(service.retrievePublished).toHaveBeenCalledWith(checker.id)
    })

    it('returns 404 on Not Found', async () => {
      const id = 'missing'
      service.retrievePublished.mockResolvedValue(undefined)
      await request(app).get(`/c/${id}`).expect(404)
      expect(service.retrievePublished).toHaveBeenCalledWith(id)
    })

    it('returns error on getPublished exception', async () => {
      const id = 'bad'
      const message = 'An error message'
      service.retrievePublished.mockRejectedValue(new Error(message))
      const response = await request(app).get(`/c/${id}`).expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.retrievePublished).toHaveBeenCalledWith(id)
    })
  })

  describe('publish', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.post('/c/drafts/:id/publish', controller.publish)

    beforeEach(() => {
      service.publish.mockReset()
    })

    it('rejects non-authenticated publish', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.post('/c/drafts/:id/publish', controller.publish)

      service.publish.mockResolvedValue(checker)
      await request(app).post(`/c/drafts/${checker.id}/publish`).expect(401)
      expect(service.publish).not.toHaveBeenCalled()
    })

    it('accepts authenticated publish', async () => {
      service.publish.mockResolvedValue(checker)
      const response = await request(app)
        .post(`/c/drafts/${checker.id}/publish`)
        .send(checker)
        .expect(200)
      expect(response.body).toStrictEqual(checker)
      expect(service.publish).toHaveBeenCalledWith(checker.id, checker, user)
    })

    it('returns error on publish exception', async () => {
      const id = 'bad'
      const message = 'An error message'
      service.publish.mockRejectedValue(new Error(message))
      const response = await request(app)
        .post(`/c/drafts/${id}/publish`)
        .send(checker)
        .expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.publish).toHaveBeenCalledWith(id, checker, user)
    })
  })

  describe('setActive', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.post('/c/drafts/:id/active', controller.setActive)

    beforeEach(() => {
      service.setActive.mockReset()
    })

    it('rejects non-authenticated setting of checker isActive', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.post('/c/drafts/:id/active', controller.setActive)

      await request(app).post(`/c/drafts/${checker.id}/active`).expect(401)
      expect(service.setActive).not.toHaveBeenCalled()
    })

    it('allows authenticated setting of checker isActive', async () => {
      const isActive = true
      const response = await request(app)
        .post(`/c/drafts/${checker.id}/active`)
        .send({ isActive })
        .expect(200)
      expect(response.body).toStrictEqual({ isActive })
      expect(service.setActive).toHaveBeenCalledWith(checker.id, user, isActive)
    })
  })

  describe('listCollaborators', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const userCollaborator = {
      ...user,
      UserToChecker: {
        isOwner: true,
      },
    }
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.get('/c/drafts/:id/collaborator', controller.listCollaborators)

    beforeEach(() => {
      service.listCollaborators.mockReset()
    })

    it('allows authenticated listing of collaborators', async () => {
      service.listCollaborators.mockResolvedValue([userCollaborator])
      const response = await request(app)
        .get(`/c/drafts/${checker.id}/collaborator`)
        .expect(200)
      expect(response.body).toStrictEqual([userCollaborator])
      expect(service.listCollaborators).toHaveBeenCalledWith(checker.id, user)
    })

    it('rejects non-authenticated listing of collaborators', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.get('/c/drafts/:id/collaborator', controller.listCollaborators)
      await request(app).get(`/c/drafts/${checker.id}/collaborator`).expect(401)
      expect(service.listCollaborators).not.toHaveBeenCalled()
    })
  })

  describe('addCollaborators', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const collaboratorEmail = 'another-user@agency.gov.sg'
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.post('/c/drafts/:id/collaborator', controller.addCollaborator)

    beforeEach(() => {
      service.addCollaborator.mockReset()
    })

    it('rejects non-authenticated adding of collaborators', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.post('/c/drafts/:id/collaborator', controller.addCollaborator)
      await request(app)
        .post(`/c/drafts/${checker.id}/collaborator`)
        .send({ collaboratorEmail })
        .expect(401)
      expect(service.addCollaborator).not.toHaveBeenCalled()
    })

    it('allows authenticated adding of collaborators', async () => {
      await request(app)
        .post(`/c/drafts/${checker.id}/collaborator`)
        .send({ collaboratorEmail })
        .expect(200)
      expect(service.addCollaborator).toHaveBeenCalledWith(
        checker.id,
        user,
        collaboratorEmail
      )
    })

    it('returns error on user exception', async () => {
      const message = 'No such user'
      service.addCollaborator.mockRejectedValue(new Error(message))
      const response = await request(app)
        .post(`/c/drafts/${checker.id}/collaborator`)
        .send({ collaboratorEmail })
        .expect(400)
      expect(response.body).toStrictEqual({ message })
      expect(service.addCollaborator).toHaveBeenCalledWith(
        checker.id,
        user,
        collaboratorEmail
      )
    })
  })

  describe('deleteCollaborator', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    const collaboratorEmail = 'another-user@agency.gov.sg'
    const app = express()
    app.use(bodyParser.json())
    app.use(sessionMiddleware({ user }))
    app.delete('/c/drafts/:id/collaborator', controller.deleteCollaborator)

    beforeEach(() => {
      service.deleteCollaborator.mockReset()
    })

    it('rejects non-authenticated deletion of collaborator', async () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(sessionMiddleware({}))
      app.delete('/c/drafts/:id/collaborator', controller.deleteCollaborator)
      await request(app)
        .delete(`/c/drafts/${checker.id}/collaborator`)
        .send({ collaboratorEmail })
        .expect(401)
      expect(service.deleteCollaborator).not.toHaveBeenCalled()
    })

    it('accepts authenticated deletion of collaborator', async () => {
      await request(app)
        .delete(`/c/drafts/${checker.id}/collaborator`)
        .send({ collaboratorEmail })
        .expect(200)
      expect(service.deleteCollaborator).toHaveBeenCalledWith(
        checker.id,
        user,
        collaboratorEmail
      )
    })

    it('return error on user exception', async () => {
      const message = 'Error removing collaborator'
      service.deleteCollaborator.mockRejectedValue(new Error(message))
      await request(app)
        .delete(`/c/drafts/${checker.id}/collaborator`)
        .send({ collaboratorEmail })
        .expect(400)
      expect(service.deleteCollaborator).toHaveBeenCalledWith(
        checker.id,
        user,
        collaboratorEmail
      )
    })
  })
})
