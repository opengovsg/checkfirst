import serverless, { Handler } from 'serverless-http'

import bootstrap from '../bootstrap'
const apiHandler = bootstrap().then((app) => serverless(app))

export const handler: Handler = async (event, context) => {
  const h = await apiHandler
  return h(event, context)
}
