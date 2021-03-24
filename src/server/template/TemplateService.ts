import { ModelOf } from '../models'
import { Template } from '../../types/template'

export class TemplateService {
  private TemplateModel: ModelOf<Template>

  constructor(options: { Template: ModelOf<unknown> }) {
    this.TemplateModel = options.Template as ModelOf<Template>
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
