import { Sequelize } from 'sequelize'
import logger from './logger'

import config from '../config'

const databaseUrl = config.get('databaseUrl')
const sqlitePath = config.get('sqlitePath')

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      timezone: '+08:00',
      logging: logger.info.bind(logger),
    })
  : new Sequelize({
      dialect: 'sqlite',
      ...(sqlitePath ? { storage: sqlitePath } : {}),
    })

export default sequelize
