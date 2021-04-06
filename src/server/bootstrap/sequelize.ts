import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import config from '../config'
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

const nodeEnv = config.get('nodeEnv') as nodeEnvType
const options: SequelizeOptions = (sequelizeConfig as databaseConfigType)[
  nodeEnv
]

const sequelize = new Sequelize(options)
sequelize.addModels([User, Checker, UserToChecker, PublishedChecker, Template])
export default sequelize
