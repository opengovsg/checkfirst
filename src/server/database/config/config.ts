import config from '../../config'
import logger from '../../bootstrap/logger'
import { parse } from 'pg-connection-string'

// We have to manually parse database URL because sequelize-typescript requires explicit
// connection parameters.
const parsed = parse(config.get('databaseUrl'))
const connectionConfig = {
  host: parsed.host,
  username: parsed.user,
  port: parsed.port ? +parsed.port : 5432,
  password: parsed.password,
  database: parsed.database,
}

module.exports = {
  development: {
    storage: config.get('sqlitePath'),
    dialect: 'sqlite',
    seederStorage: 'sequelize',
  },
  staging: {
    timezone: '+08:00',
    logging: logger.info.bind(logger),
    dialect: 'postgres',
    seederStorage: 'sequelize',
    ...connectionConfig,
  },
  production: {
    timezone: '+08:00',
    logging: logger.info.bind(logger),
    dialect: 'postgres',
    seederStorage: 'sequelize',
    ...connectionConfig,
  },
}
