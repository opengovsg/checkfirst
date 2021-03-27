import { Sequelize } from 'sequelize-typescript'
import { CheckerService } from '..'
import {
  Checker as CheckerModel,
  User as UserModel,
  UserToChecker as UserToCheckerModel,
} from '../../database/models'
import { Checker } from '../../../types/checker'
import { User } from '../../../types/user'

describe('CheckerService', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: undefined,
    models: [UserModel, CheckerModel, UserToCheckerModel],
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
      // FIX:
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await CheckerModel.create((checker as any) as CheckerModel)

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

    it("retrieves users' checker without user info if another user", async () => {
      const actualChecker = await service.retrieve(checker.id, anotherUser)

      expect(actualChecker).toMatchObject(checker)
      expect(actualChecker?.users).not.toBeDefined()
    })

    it("retrieves users' checker without user info if anonymous", async () => {
      const actualChecker = await service.retrieve(checker.id)

      expect(actualChecker).toMatchObject(checker)
      expect(actualChecker?.users).not.toBeDefined()
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
})
