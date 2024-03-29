import { Sequelize } from 'sequelize-typescript'
import { CheckerService } from '..'
import {
  Checker as CheckerModel,
  User as UserModel,
  UserToChecker as UserToCheckerModel,
  PublishedChecker as PublishedCheckerModel,
} from '../../database/models'
import { Checker } from '../../../types/checker'
import { CollaboratorUser, User } from '../../../types/user'

describe('CheckerService', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/tmp/testDB.sqlite',
    logging: undefined,
    models: [
      UserModel,
      CheckerModel,
      UserToCheckerModel,
      PublishedCheckerModel,
    ],
  })
  const sequelizeReady = sequelize.sync()

  const service = new CheckerService({ sequelize })

  const user: User = { id: 1, email: 'user@agency.gov.sg' }
  const checker: Checker = {
    id: 'existing-checker',
    title: 'Existing Checker',
    fields: [],
    constants: [],
    operations: [],
    displays: [],
  }

  const checkerWithActive = {
    ...checker,
    isActive: false,
  }

  const unpublishedChecker: Checker = {
    ...checker,
    id: 'unpublished-checker',
  }

  const newPublishedChecker: Checker = {
    ...checker,
    title: 'New Published Title',
  }

  const anotherUser: User = { id: 2, email: 'another-user@agency.gov.sg' }
  const anotherChecker: Checker = {
    id: 'another-checker',
    title: 'Another Checker',
    fields: [],
    constants: [],
    operations: [],
    displays: [],
  }

  beforeAll(async () => {
    await sequelizeReady
  })

  describe('create', () => {
    beforeEach(async () => {
      await CheckerModel.destroy({ truncate: true })
      await UserModel.destroy({ truncate: true })
    })
    it('returns false if checker exists', async () => {
      await CheckerModel.create(checkerWithActive)

      const created = await service.create(checker, user)

      expect(created).toBe(false)
    })

    it('throws error if user does not exist', async () => {
      await expect(() => service.create(checker, user)).rejects.toThrowError()
    })

    it('successfully creates a checker', async () => {
      await UserModel.create(user)

      const created = await service.create(checker, user)

      expect(created).toBe(true)
      const checkerInstance = await CheckerModel.findByPk(checker.id, {
        include: [UserModel],
      })
      const actualChecker = checkerInstance?.toJSON() as Record<string, unknown>
      expect(actualChecker).toMatchObject(checker)
      expect(actualChecker?.users).toBeDefined()
      const [actualUser] = actualChecker?.users as Record<string, unknown>[]
      expect(actualUser).toMatchObject(user)
    })
  })

  describe('list', () => {
    beforeEach(async () => {
      await CheckerModel.destroy({ truncate: true })
      await UserModel.destroy({ truncate: true })
    })
    it("lists users' respective checkers", async () => {
      await UserModel.create(user)
      await UserModel.create(anotherUser)
      await service.create(checker, user)
      await service.create(anotherChecker, anotherUser)

      const [actualChecker, ...rest] = await service.list(user)
      const [actualAnotherChecker, ...anotherRest] = await service.list(
        anotherUser
      )

      expect(actualChecker).toMatchObject(checker)
      expect(actualAnotherChecker).toMatchObject(anotherChecker)
      expect(rest).toStrictEqual([])
      expect(anotherRest).toStrictEqual([])
    })
  })

  describe('retrieve', () => {
    beforeAll(async () => {
      await CheckerModel.destroy({ truncate: true })
      await UserModel.destroy({ truncate: true })
      await UserModel.create(user)
      await UserModel.create(anotherUser)
      await service.create(checker, user)
    })

    it("retrieves users' checker with user info if user", async () => {
      const actualChecker = await service.retrieve(checker.id, user)

      expect(actualChecker).toMatchObject({
        ...checker,
        users: expect.arrayContaining([expect.objectContaining(user)]),
      })
    })

    it('throws if unauthorized user', async () => {
      await expect(
        service.retrieve(checker.id, anotherUser)
      ).rejects.toMatchObject(new Error('Unauthorized'))
    })
  })

  describe('update', () => {
    const change = { description: 'New Description' }

    beforeAll(async () => {
      await UserModel.destroy({ truncate: true })
      await UserModel.create(user)
      await UserModel.create(anotherUser)
    })
    beforeEach(async () => {
      await CheckerModel.destroy({ truncate: true })
      await service.create(checker, user)
    })

    it('effects no change if id not found', async () => {
      const count = await service.update(anotherChecker.id, change, user)
      expect(count).toBe(0)
      const checkerInstance = await CheckerModel.findByPk(checker.id)
      expect(checkerInstance).toMatchObject(checker)
    })

    it('throws if unauthorized user', async () => {
      await expect(
        service.update(checker.id, change, anotherUser)
      ).rejects.toMatchObject(new Error('Unauthorized'))
      const checkerInstance = await CheckerModel.findByPk(checker.id)
      expect(checkerInstance).toMatchObject(checker)
    })

    it('effects change if id found and correct user', async () => {
      const count = await service.update(checker.id, change, user)
      expect(count).toBe(1)
      const checkerInstance = await CheckerModel.findByPk(checker.id)
      expect(checkerInstance).toMatchObject({ ...checker, ...change })
    })
  })

  describe('delete', () => {
    beforeAll(async () => {
      await UserModel.destroy({ truncate: true })
      await UserModel.create(user)
      await UserModel.create(anotherUser)
    })
    beforeEach(async () => {
      await CheckerModel.destroy({ truncate: true })
      await service.create(checker, user)
    })

    it('does not delete if id not found', async () => {
      const count = await service.delete(anotherChecker.id, user)
      expect(count).toBe(0)
      const checkerInstance = await CheckerModel.findByPk(checker.id)
      expect(checkerInstance).toMatchObject(checker)
    })

    it('throws if delete by unauthorized user', async () => {
      await expect(
        service.delete(checker.id, anotherUser)
      ).rejects.toMatchObject(new Error('Unauthorized'))
      const checkerInstance = await CheckerModel.findByPk(checker.id)
      expect(checkerInstance).toMatchObject(checker)
    })

    it('deletes if id found and correct user', async () => {
      const count = await service.delete(checker.id, user)
      expect(count).toBe(1)
      const checkerInstance = await CheckerModel.findByPk(checker.id)
      expect(checkerInstance).toBeNull()
    })
  })

  describe('getPublished', () => {
    beforeAll(async () => {
      await CheckerModel.destroy({ truncate: true })
      await UserModel.destroy({ truncate: true })
      await UserModel.create(user)
      await service.create(checker, user)
    })

    it('retrieves no checker if not published', async () => {
      await expect(service.retrievePublished(checker.id)).rejects
    })

    it('retrieves latest published version of checker', async () => {
      // Publish 2 checker versions but expect to retrieve only the latest published checker
      await service.publish(checker.id, checker, user)
      await service.publish(checker.id, newPublishedChecker, user)
      const actualPublishedChecker = await service.retrievePublished(checker.id)

      expect(actualPublishedChecker).toMatchObject({
        ...newPublishedChecker,
      })
    })
  })

  describe('collaborators', () => {
    const collaboratorUser: CollaboratorUser = {
      ...user,
      UserToChecker: {
        isOwner: true,
      },
    }
    const anotherCollaboratorUser: CollaboratorUser = {
      ...anotherUser,
      UserToChecker: {
        isOwner: false,
      },
    }
    beforeEach(async () => {
      await CheckerModel.destroy({ truncate: true })
      await UserModel.destroy({ truncate: true })
      await UserModel.create(user)
      await UserModel.create(anotherUser)
      await service.create(checker, user)
    })

    it('should throw error if user is not collaborator of checker when listing collaborators', async () => {
      await expect(
        service.listCollaborators(checker.id, anotherUser)
      ).rejects.toMatchObject(new Error('Unauthorized'))
    })

    it('should list all collaborators of the checker if user is collaborator of checker', async () => {
      const collaborators = await service.listCollaborators(checker.id, user)
      expect(collaborators.length).toBe(1)
      expect(collaborators[0]).toMatchObject(collaboratorUser)
    })

    it('does not add collaborator if not already user', async () => {
      await UserModel.destroy({ where: { email: anotherUser.email } })
      await expect(
        service.addCollaborator(checker.id, user, anotherUser.email)
      ).rejects.toMatchObject(new Error('No such user'))
      const collaborators = await service.listCollaborators(checker.id, user)
      expect(collaborators.length).toBe(1)
    })

    it('does not add collaborator if user to add is already a collaborator', async () => {
      await expect(
        service.addCollaborator(checker.id, user, user.email)
      ).rejects.toMatchObject(new Error('User is already a collaborator'))
      const collaborators = await service.listCollaborators(checker.id, user)
      expect(collaborators.length).toBe(1)
    })

    it('successfully adds new user as collaborator', async () => {
      await service.addCollaborator(checker.id, user, anotherUser.email)
      const collaborators = await service.listCollaborators(checker.id, user)
      expect(collaborators.length).toBe(2)
      expect(collaborators[1]).toMatchObject(anotherCollaboratorUser)
    })

    it('should not delete collaborator if collaborator to delete is owner', async () => {
      await service.addCollaborator(checker.id, user, anotherUser.email)
      await expect(
        service.deleteCollaborator(checker.id, anotherUser, user.email)
      ).rejects.toMatchObject(new Error('Error removing collaborator'))
      const collaborators = await service.listCollaborators(checker.id, user)
      expect(collaborators.length).toBe(2)
    })

    it('successfully deletes collaborator if collaborator is not owner', async () => {
      await service.addCollaborator(checker.id, user, anotherUser.email)
      await service.deleteCollaborator(checker.id, user, anotherUser.email)
      const collaborators = await service.listCollaborators(checker.id, user)
      expect(collaborators.length).toBe(1)
      expect(collaborators[0]).toMatchObject(collaboratorUser)
    })
  })

  describe('publish', () => {
    beforeAll(async () => {
      await CheckerModel.destroy({ truncate: true })
      await UserModel.destroy({ truncate: true })
      await UserModel.create(user)
      await service.create(checker, user)
      await service.publish(checker.id, newPublishedChecker, user)
    })

    it('updates checker table on publish', async () => {
      const actualChecker = await service.retrieve(checker.id, user)

      expect(actualChecker).toMatchObject({
        ...newPublishedChecker,
        users: expect.arrayContaining([expect.objectContaining(user)]),
      })
    })

    it('updates creates new publishedChecker on publish and sets isActive of checker to true', async () => {
      const actualPublishedChecker = await service.retrievePublished(checker.id)

      expect(actualPublishedChecker).toMatchObject({
        ...newPublishedChecker,
        isActive: true,
      })
    })
  })

  describe('setActive', () => {
    beforeAll(async () => {
      await CheckerModel.destroy({ truncate: true })
      await UserModel.destroy({ truncate: true })
      await UserModel.create(user)
      await service.create(checker, user)
      await service.create(unpublishedChecker, user)
      await UserModel.create(anotherUser)
      await service.publish(checker.id, checker, user)
    })

    it('should throw error if user is not a collaborator of checker', async () => {
      await expect(
        service.setActive(checker.id, anotherUser, false)
      ).rejects.toMatchObject(new Error('Unauthorized'))
    })

    it('should throw an error if the checker is not yet published', async () => {
      await expect(
        service.setActive(unpublishedChecker.id, user, true)
      ).rejects.toMatchObject(
        new Error('Unpublished checker cannot be set to active')
      )
    })

    it('changes isActive of checker when user is a collaborator', async () => {
      await service.setActive(checker.id, user, false)
      const publishedChecker = await service.retrievePublished(checker.id)
      expect(publishedChecker?.isActive).toEqual(false)
    })
  })
})
