import { Sequelize } from 'sequelize'
import logger from './logger'

import config from '../config'

const nodeEnv = config.get('nodeEnv')
const databaseUrl = config.get('databaseUrl')

export const sequelize =
  nodeEnv === 'development'
    ? new Sequelize({ dialect: 'sqlite' })
    : new Sequelize(databaseUrl, {
        timezone: '+08:00',
        logging: logger.info.bind(logger),
      })

export default sequelize
