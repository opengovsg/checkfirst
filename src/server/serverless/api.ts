import serverless, { Handler } from 'serverless-http'
import { Sequelize } from 'sequelize-typescript'

import bootstrap from '../bootstrap'
import logger from '../bootstrap/logger'
import loadSequelize from '../bootstrap/loadSequelize'

// This non-handler section runs
let sequelize: Sequelize | null = null

export const handler: Handler = async (event, context) => {
  // re-use the sequelize instance across invocations to improve performance
  if (!sequelize) {
    sequelize = await loadSequelize()
  } else {
    // restart connection pool to ensure connections are not re-used across invocations
    sequelize.connectionManager.initPools()

    // restore `getConnection()` if it has been overwritten by `close()`
    if (sequelize.connectionManager.hasOwnProperty('getConnection')) {
      // @ts-ignore
      // There is some jankiness in the Sequelize `connectionManager` module where `close()`
      // overwrites the `getConnection()` method to throw an error.
      // https://github.com/sequelize/sequelize/pull/12642#discussion_r613287823
      delete sequelize.connectionManager.getConnection
    }
  }

  const app = await bootstrap(sequelize)
  const h = serverless(app)
  try {
    return await h(event, context)
  } finally {
    logger.info('Closing Sequelize connection')
    await sequelize.connectionManager.close()
  }
}
