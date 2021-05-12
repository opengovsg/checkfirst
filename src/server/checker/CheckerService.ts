import {
  Checker,
  CreatePublishedCheckerDTO,
  GetPublishedCheckerWithoutDraftCheckerDTO,
} from '../../types/checker'
import { User } from '../../types/user'
import { Model, Sequelize } from 'sequelize-typescript'
import { Logger } from 'winston'
import {
  Checker as CheckerModel,
  User as UserModel,
  PublishedChecker as PublishedCheckerModel,
} from '../database/models'

export class CheckerService {
  private sequelize: Sequelize
  private logger?: Logger
  private CheckerModel: typeof CheckerModel
  private UserModel: typeof UserModel
  private PublishedCheckerModel: typeof PublishedCheckerModel
  private isSqliteFile: boolean
  constructor(options: { sequelize: Sequelize; logger?: Logger }) {
    this.sequelize = options.sequelize
    this.logger = options.logger
    this.CheckerModel = CheckerModel
    this.UserModel = UserModel
    this.PublishedCheckerModel = PublishedCheckerModel
    this.isSqliteFile =
      this.sequelize.getDialect() === 'sqlite' &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (this.sequelize as unknown as Record<string, unknown>).options.storage
  }

  create: (checker: Checker, user: User) => Promise<boolean> = async (
    checker,
    user
  ) => {
    const transaction = await this.sequelize.transaction()
    const options = this.isSqliteFile ? {} : { transaction }
    try {
      const existingChecker = await this.CheckerModel.findByPk(
        checker.id,
        options
      )
      if (!existingChecker) {
        const userInstance = await this.UserModel.findByPk(user.id)
        if (!userInstance) {
          throw new Error(`User ${user.id} [${user.email}] not found`)
        }

        const checkerInstance = await this.CheckerModel.create(checker, options)
        // We definitely know that userInstance can add associations
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (userInstance as any).addChecker(checkerInstance, options)
      }
      await transaction.commit()
      return existingChecker === null
    } catch (error) {
      this.logger?.error(error)
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
      order: [['updatedAt', 'DESC']],
    })
    return result
  }

  retrieve: (id: string, user: User) => Promise<Checker | null> = async (
    id,
    user
  ) => {
    return await this.findAndCheckAuth(id, user)
  }

  retrievePublished: (
    id: string
  ) => Promise<GetPublishedCheckerWithoutDraftCheckerDTO | null> = async (
    id
  ) => {
    const result = await this.PublishedCheckerModel.findOne({
      attributes: [
        ['checkerId', 'id'], // rename checkerId as id
        'title',
        'description',
        'fields',
        'constants',
        'operations',
        'displays',
      ],
      where: { checkerId: id },
      order: [['createdAt', 'DESC']],
    })

    return result
  }

  publish: (id: string, checker: Checker, user: User) => Promise<Checker> =
    async (id, checker, user) => {
      const transaction = await this.sequelize.transaction()
      const transactionOptions = this.isSqliteFile ? {} : { transaction }

      try {
        const existingChecker = await this.findAndCheckAuth(id, user)
        if (!existingChecker) throw new Error(`Checker ${id} not found`)

        // Perform update in checkers and create in publishedCheckers with 1 transaction
        await this.CheckerModel.update(checker, {
          where: { id },
          ...transactionOptions,
        })

        const createPublishedChecker: CreatePublishedCheckerDTO = {
          title: checker.title,
          description: checker.description,
          fields: checker.fields,
          constants: checker.constants,
          operations: checker.operations,
          displays: checker.displays,
          checkerId: id, // we want to make sure that we are publishing the right checker
        }

        await this.PublishedCheckerModel.create(createPublishedChecker, {
          ...transactionOptions,
        })

        await transaction.commit()
        return checker
      } catch (error) {
        this.logger?.error(error)
        await transaction.rollback()
        throw error
      }
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
