import { IMinimatch } from 'minimatch'
import { BuildOptions, Model, Sequelize } from 'sequelize'

import * as CheckerModel from './Checker'
import * as UserModel from './User'

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
    Checker: CheckerModel.init(sequelize),
    User: UserModel.init(sequelize, options),
  }
  return result
}
