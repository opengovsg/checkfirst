import { ApiClient } from '../api'

import Template from '../../types/template'

const listTemplates = async (): Promise<Template[]> => {
  return ApiClient.get('/template').then((res) => res.data)
}

const getTemplate = async (id: string): Promise<Template> => {
  return ApiClient.get(`/template/${id}`).then((res) => res.data)
}

export const TemplateService = {
  listTemplates,
  getTemplate,
}
