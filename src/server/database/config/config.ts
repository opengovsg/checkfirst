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

// Obtained from marcogrcr: https://github.com/sequelize/sequelize/pull/12642
// These only apply to the staging and production environment and not development because they are meant for lambda
const lambdaBestPracticesConfig = {
  pool: {
    /*
     * Lambda functions process one request at a time but your code may issue multiple queries
     * concurrently. Be wary that `sequelize` has methods that issue 2 queries concurrently
     * (e.g. `Model.findAndCountAll()`). Using a value higher than 1 allows concurrent queries to
     * be executed in parallel rather than serialized. Careful with executing too many queries in
     * parallel per Lambda function execution since that can bring down your database with an
     * excessive number of connections.
     *
     * Ideally you want to choose a `max` number where this holds true:
     * max * EXPECTED_MAX_CONCURRENT_LAMBDA_INVOCATIONS < MAX_ALLOWED_DATABASE_CONNECTIONS * 0.8
     */
    max: 2,
    /*
     * Set this value to 0 so connection pool eviction logic eventually cleans up all connections
     * in the event of a Lambda function timeout.
     */
    min: 0,
    /*
     * Set this value to 0 so connections are eligible for cleanup immediately after they're
     * returned to the pool.
     */
    idle: 0,
    // Choose a small enough value that fails fast if a connection takes too long to be established.
    acquire: 3000,
    /*
     * Ensures the connection pool attempts to be cleaned up automatically on the next Lambda
     * function invocation, if the previous invocation timed out. This value is set to the default lambda timeout,
     * which is 30 seconds.
     */
    evict: 30000,
  },
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
    ...lambdaBestPracticesConfig,
  },
  production: {
    timezone: '+08:00',
    logging: logger.info.bind(logger),
    dialect: 'postgres',
    seederStorage: 'sequelize',
    ...connectionConfig,
    ...lambdaBestPracticesConfig,
  },
}
