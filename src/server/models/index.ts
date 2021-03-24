import { IMinimatch } from 'minimatch'
import { BuildOptions, Model, Sequelize } from 'sequelize'

import * as CheckerFactory from './Checker'
import * as UserFactory from './User'
import * as TemplateFactory from './Template'

// Circumvent issues with typescript not knowing about `this`
// variable during compile time. For use in setters in model
// definition.
export interface Settable {
  setDataValue(key: string, value: unknown): void
}

export type ModelOf<T> = T &
  typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): Model & T
  }

export const addModelsTo = (
  sequelize: Sequelize,
  options: { emailValidator: IMinimatch }
): Record<string, ModelOf<unknown>> => {
  const result = {
    Checker: CheckerFactory.init(sequelize),
    User: UserFactory.init(sequelize, options),
    Template: TemplateFactory.init(sequelize),
  }
  const joinOptions = { through: 'usersToCheckers' }
  result.Checker.belongsToMany(result.User, joinOptions)
  result.User.belongsToMany(result.Checker, joinOptions)
  return result
}
