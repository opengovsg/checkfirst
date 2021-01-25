import serverless, { Handler } from 'serverless-http'

import bootstrap from './bootstrap'

const serverlessHandler = bootstrap().then(serverless)

export const handler: Handler = async (event, context) => {
  const h = await serverlessHandler
  return h(event, context)
}
