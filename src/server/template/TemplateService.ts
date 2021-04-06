import { Template } from '../../types/template'
import { Template as TemplateModel } from '../database/models'

export class TemplateService {
  private TemplateModel: typeof TemplateModel

  constructor() {
    this.TemplateModel = TemplateModel
  }

  list: () => Promise<Template[]> = async () => {
    const result = await this.TemplateModel.findAll()
    return result
  }

  retrieve: (templateId: number) => Promise<Template | null> = async (
    templateId
  ) => {
    const result = await this.TemplateModel.findByPk(templateId)
    return result
  }
}

export default TemplateService
