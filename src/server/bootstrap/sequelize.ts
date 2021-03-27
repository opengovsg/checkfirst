import { Sequelize } from 'sequelize-typescript'
import logger from './logger'

import config from '../config'
import { User, Checker, UserToChecker } from '../database/models'

const databaseUrl = config.get('databaseUrl')
const sqlitePath = config.get('sqlitePath')

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      timezone: '+08:00',
      logging: logger.info.bind(logger),
    })
  : new Sequelize({
      dialect: 'sqlite',
      ...(sqlitePath ? { storage: sqlitePath } : {}),
    })

sequelize.addModels([User, Checker, UserToChecker])
export default sequelize
