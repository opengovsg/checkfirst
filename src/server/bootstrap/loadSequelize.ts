import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import config from '../config'
import logger from './logger'
import {
  databaseConfigType,
  nodeEnvType,
} from '../../types/server/sequelize-config'
import * as sequelizeConfig from '../database/config/config'
import {
  User,
  Checker,
  UserToChecker,
  PublishedChecker,
  Template,
} from '../database/models'

const loadSequelize = async () => {
  const nodeEnv = config.get('nodeEnv') as nodeEnvType
  const options: SequelizeOptions = (sequelizeConfig as databaseConfigType)[
    nodeEnv
  ]

  const sequelize = new Sequelize(options)
  sequelize.addModels([
    User,
    Checker,
    UserToChecker,
    PublishedChecker,
    Template,
  ])

  logger.info('Connecting to Sequelize')
  await sequelize.authenticate()
  return sequelize
}

export default loadSequelize
