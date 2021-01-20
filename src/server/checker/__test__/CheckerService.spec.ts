import minimatch from 'minimatch'
import { Sequelize } from 'sequelize'
import { addModelsTo } from '../../models'
import { CheckerService } from '..'

describe('CheckerService', () => {
  const emailValidator = new minimatch.Minimatch('*.gov.sg')

  const sequelize = new Sequelize({ dialect: 'sqlite', logging: undefined })
  const { User, Checker } = addModelsTo(sequelize, { emailValidator })

  const sequelizeReady = sequelize.sync()

  const service = new CheckerService({ sequelize, User, Checker })

  beforeEach(async () => {
    await sequelizeReady
  })

  describe('create', () => {
    const user = { id: 1, email: 'user@agency.gov.sg' }
    beforeEach(async () => {
      await Checker.destroy({ truncate: true })
      await User.destroy({ truncate: true })
    })
    it('returns false if checker exists', async () => {
      const checker = {
        id: 'existing-checker',
        title: 'Existing Checker',
        fields: [],
        constants: [],
        operations: [],
        displays: [],
      }
      await Checker.create(checker)
      const created = await service.create(checker, user)
      expect(created).toBe(false)
    })

    it('throws error if user does not exist', async () => {
      const checker = {
        id: 'existing-checker',
        title: 'Existing Checker',
        fields: [],
        constants: [],
        operations: [],
        displays: [],
      }
      await expect(() => service.create(checker, user)).rejects.toThrowError()
    })

    it('successfully creates a checker', async () => {
      const checker = {
        id: 'existing-checker',
        title: 'Existing Checker',
        fields: [],
        constants: [],
        operations: [],
        displays: [],
      }
      await User.create(user)
      const created = await service.create(checker, user)
      expect(created).toBe(true)
      const checkerInstance = await Checker.findByPk(checker.id, {
        include: [User],
      })
      const actualChecker = checkerInstance?.toJSON() as Record<string, unknown>
      expect(actualChecker).toMatchObject(checker)
      expect(actualChecker?.users).toBeDefined()
      const [actualUser] = actualChecker?.users as Record<string, unknown>[]
      expect(actualUser).toMatchObject(user)
    })
  })
})
