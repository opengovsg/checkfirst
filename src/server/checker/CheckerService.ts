import { ModelOf } from '../models'
import { Checker } from '../../types/checker'
import { WhereAttributeHash } from 'sequelize/types'

export class CheckerService {
  private CheckerModel: ModelOf<Checker>
  constructor(options: { Checker: ModelOf<unknown> }) {
    this.CheckerModel = options.Checker as ModelOf<Checker>
  }

  create: (checker: Checker) => Promise<boolean> = async (checker) => {
    const [, created] = await this.CheckerModel.findOrCreate({
      where: { id: checker.id },
      defaults: checker,
    })
    return created
  }

  list: (findOptions?: {
    where: WhereAttributeHash
  }) => Promise<Checker[]> = async (findOptions) => {
    const result = await this.CheckerModel.findAll(findOptions)
    return result
  }

  retrieve: (id: string) => Promise<Checker | null> = async (id) => {
    const result = await this.CheckerModel.findByPk(id)
    return result
  }

  update: (id: string, checker: Partial<Checker>) => Promise<number> = async (
    id,
    checker
  ) => {
    const [count] = await this.CheckerModel.update(checker, {
      where: { id },
    })
    return count
  }

  delete: (id: string) => Promise<number> = async (id) => {
    const count = await this.CheckerModel.destroy({ where: { id } })
    return count
  }
}

export default CheckerService
