import { Sequelize } from 'sequelize-typescript'
import { Template as TemplateModel } from '../../database/models'
import { TemplateService } from '..'

describe('TemplateService', () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: undefined,
    models: [TemplateModel],
  })

  const sequelizeReady = sequelize.sync()
  const service = new TemplateService()

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
      await TemplateModel.truncate()
    })

    it('lists templates', async () => {
      await TemplateModel.create(template)

      const [actualTemplate, ...rest] = await service.list()
      expect(actualTemplate).toMatchObject(template)
      expect(rest.length).toBe(0)
    })
  })

  describe('retrieve', () => {
    beforeEach(async () => {
      await TemplateModel.truncate()
    })

    it('retrieve template with id', async () => {
      await TemplateModel.create(template)
      const actualTemplate = await service.retrieve(template.id)
      expect(actualTemplate).toMatchObject(template)
    })

    it('returns undefined for non-existent id', async () => {
      const actualTemplate = await service.retrieve(1)
      expect(actualTemplate).toBeNull()
    })
  })
})
