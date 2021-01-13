import { BuildOptions, Model, Sequelize } from 'sequelize'
import * as CheckerModel from './Checker'

export type ModelOf<T> = typeof Model & {
  new (values?: Record<string, unknown>, options?: BuildOptions): T
}

export const addModelsTo = (
  sequelize: Sequelize
): Record<string, ModelOf<unknown>> => {
  const result = {
    Checker: CheckerModel.init(sequelize),
  }
  return result
}
