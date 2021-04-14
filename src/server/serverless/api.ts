import serverless, { Handler } from 'serverless-http'

import bootstrap from '../bootstrap'
import logger from '../bootstrap/logger'

export const handler: Handler = async (event, context) => {
  const { app, sequelize } = await bootstrap()
  const h = serverless(app)
  try {
    return await h(event, context)
  } finally {
    logger.info('Closing Sequelize connection')
    await sequelize.close()
  }
}
