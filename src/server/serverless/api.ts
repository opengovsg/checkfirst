import serverless, { Handler } from 'serverless-http'

import bootstrap from '../bootstrap'

export const handler: Handler = async (event, context) => {
  const h = await bootstrap().then((app) => serverless(app))
  return h(event, context)
}
