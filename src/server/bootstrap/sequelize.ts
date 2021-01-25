import { Sequelize } from 'sequelize'
import logger from './logger'

import config from '../config'

const databaseUrl = config.get('databaseUrl')

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      timezone: '+08:00',
      logging: logger.info.bind(logger),
    })
  : new Sequelize({ dialect: 'sqlite' })

export default sequelize
