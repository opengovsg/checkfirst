import { ModelOf } from '../models'
import { Checker } from '../../types/checker'
import { User } from '../../types/user'
import { Model, Sequelize } from 'sequelize'

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

  list: (user: User) => Promise<Checker[]> = async (user) => {
    const result = await this.CheckerModel.findAll({
      include: [
        {
          model: this.UserModel,
          where: { id: user.id },
        },
      ],
    })
    return result
  }

  retrieve: (id: string, user?: User) => Promise<Checker | null> = async (
    id,
    user
  ) => {
    const result = await this.CheckerModel.findByPk(
      id,
      user ? { include: [this.UserModel] } : undefined
    )
    if (result && user) {
      const isAuthorized = result.users?.some((u) => u.id === user.id)
      if (!isAuthorized) {
        const resultWithoutUsers: Checker = { ...(result.toJSON() as Checker) }
        delete resultWithoutUsers.users
        return resultWithoutUsers
      }
    }
    return result
  }

  private findAndCheckAuth: (
    id: string,
    user: User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<(Model<Checker, any> & Checker) | null> = async (id, user) => {
    const checker = await this.CheckerModel.findByPk(id, {
      include: [this.UserModel],
    })
    if (checker) {
      const isAuthorized = checker.users?.some((u) => u.id === user.id)
      if (!isAuthorized) {
        throw new Error('Unauthorized')
      }
    }
    return checker
  }

  update: (
    id: string,
    checker: Partial<Checker>,
    user: User
  ) => Promise<number> = async (id, checker, user) => {
    const c = await this.findAndCheckAuth(id, user)
    if (c) {
      const [count] = await this.CheckerModel.update(checker, {
        where: { id },
      })
      return count
    } else {
      return 0
    }
  }

  delete: (id: string, user: User) => Promise<number> = async (id, user) => {
    const checker = await this.findAndCheckAuth(id, user)
    if (checker) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (checker as any).setUsers([])
      return this.CheckerModel.destroy({ where: { id } })
    } else {
      return 0
    }
  }
}

export default CheckerService
