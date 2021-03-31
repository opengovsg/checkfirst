import config from '../../config'
import logger from '../../bootstrap/logger'

module.exports = {
  development: {
    storage: config.get('sqlitePath'),
    dialect: 'sqlite',
  },
  staging: {
    url: config.get('databaseUrl'),
    timezone: '+08:00',
    logging: logger.info.bind(logger),
  },
  production: {
    url: config.get('databaseUrl'),
    timezone: '+08:00',
    logging: logger.info.bind(logger),
  },
}
