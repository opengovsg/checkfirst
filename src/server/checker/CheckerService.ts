import { ModelOf } from '../models'
import { Checker } from '../../types/checker'
import { User } from '../../types/user'
import { Sequelize } from 'sequelize'
import { WhereAttributeHash } from 'sequelize/types'

export class CheckerService {
  private sequelize: Sequelize
  private CheckerModel: ModelOf<Checker>
  private UserModel: ModelOf<User>
  constructor(options: {
    sequelize: Sequelize
    Checker: ModelOf<unknown>
    User: ModelOf<unknown>
  }) {
    this.sequelize = options.sequelize
    this.CheckerModel = options.Checker as ModelOf<Checker>
    this.UserModel = options.User as ModelOf<User>
  }

  create: (checker: Checker, user: User) => Promise<boolean> = async (
    checker,
    user
  ) => {
    const transaction = await this.sequelize.transaction()
    try {
      const existingChecker = await this.CheckerModel.findByPk(checker.id, {
        transaction,
      })
      if (!existingChecker) {
        const userInstance = await this.UserModel.findByPk(user.id)
        if (!userInstance) {
          throw new Error(`User ${user.id} [${user.email}] not found`)
        }
        const checkerInstance = await this.CheckerModel.create(checker, {
          transaction,
        })
        // We definitely know that userInstance can add associations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (userInstance as any).addChecker(checkerInstance)
      }
      await transaction.commit()
      return existingChecker === null
    } catch (error) {
      console.error(error)
      await transaction.rollback()
      throw error
    }
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
