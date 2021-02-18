import serverless, { Handler } from 'serverless-http'

import bootstrap from './bootstrap'

const BINARY_CONTENT_TYPES = ['image/png']

const serverlessHandler = bootstrap().then((app) =>
  serverless(app, {
    binary: BINARY_CONTENT_TYPES,
  })
)

export const handler: Handler = async (event, context) => {
  const h = await serverlessHandler
  return h(event, context)
}
