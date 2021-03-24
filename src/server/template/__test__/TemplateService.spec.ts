import minimatch from 'minimatch'
import { Sequelize } from 'sequelize'
import { addModelsTo } from '../../models'
import { TemplateService } from '..'

describe('TemplateService', () => {
  const emailValidator = new minimatch.Minimatch('*.gov.sg')
  const sequelize = new Sequelize({ dialect: 'sqlite', logging: undefined })
  const { Template } = addModelsTo(sequelize, { emailValidator })

  const sequelizeReady = sequelize.sync()
  const service = new TemplateService({ Template })

  const template = {
    id: 1,
    title: 'title',
    description: 'description',
    fields: [],
    constants: [],
    displays: [],
    operations: [],
  }

  beforeAll(async () => {
    await sequelizeReady
  })

  describe('list', () => {
    beforeEach(async () => {
      await Template.truncate()
    })

    it('lists templates', async () => {
      await Template.create(template)

      const [actualTemplate, ...rest] = await service.list()
      expect(actualTemplate).toMatchObject(template)
      expect(rest.length).toBe(0)
    })
  })

  describe('retrieve', () => {
    beforeEach(async () => {
      await Template.truncate()
    })

    it('retrieve template with id', async () => {
      await Template.create(template)
      const actualTemplate = await service.retrieve(template.id)
      expect(actualTemplate).toMatchObject(template)
    })

    it('returns undefined for non-existent id', async () => {
      const actualTemplate = await service.retrieve(1)
      expect(actualTemplate).toBeNull()
    })
  })
})
