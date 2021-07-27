import {
  Checker,
  CheckerWithActive,
  CreatePublishedCheckerDTO,
  GetPublishedCheckerWithoutDraftCheckerDTO,
} from '../../types/checker'
import { CollaboratorUser, User } from '../../types/user'
import { Model, Sequelize } from 'sequelize-typescript'
import { Logger } from 'winston'
import {
  Checker as CheckerModel,
  User as UserModel,
  PublishedChecker as PublishedCheckerModel,
  UserToChecker as UserToCheckerModel,
} from '../database/models'
import { Transaction } from 'sequelize'
import _ from 'lodash'

export class CheckerService {
  private sequelize: Sequelize
  private logger?: Logger
  private CheckerModel: typeof CheckerModel
  private UserModel: typeof UserModel
  private PublishedCheckerModel: typeof PublishedCheckerModel
  private UserToCheckerModel: typeof UserToCheckerModel
  private isSqliteFile: boolean
  constructor(options: { sequelize: Sequelize; logger?: Logger }) {
    this.sequelize = options.sequelize
    this.logger = options.logger
    this.CheckerModel = CheckerModel
    this.UserModel = UserModel
    this.PublishedCheckerModel = PublishedCheckerModel
    this.UserToCheckerModel = UserToCheckerModel
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
        const userInstance = await this.UserModel.findByPk(user.id, options)
        if (!userInstance) {
          throw new Error(`User ${user.id} [${user.email}] not found`)
        }

        const checkerInstance = await this.CheckerModel.create(
          {
            ...checker,
            isActive: false,
          },
          options
        )

        await this.UserToCheckerModel.create(
          {
            checkerId: checkerInstance.id,
            userId: userInstance.id,
            isOwner: true,
          },
          options
        )
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
        {
          model: this.PublishedCheckerModel,
          attributes: ['id', 'createdAt'],
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
    const checker = await this.findAndCheckAuth(id, user)
    if (checker) return _.omit(checker.toJSON(), ['isActive']) as Checker
    else return null
  }

  retrievePublished: (
    id: string
  ) => Promise<GetPublishedCheckerWithoutDraftCheckerDTO | null> = async (
    id
  ) => {
    const transaction = await this.sequelize.transaction()
    const options = this.isSqliteFile ? {} : { transaction }

    try {
      // Check if checker is active
      const checker = await this.CheckerModel.findByPk(id)
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
        ...options,
      })

      await transaction.commit()
      if (result)
        return {
          ...result.toJSON(),
          isActive: !!checker?.isActive,
        } as GetPublishedCheckerWithoutDraftCheckerDTO
      else return null
    } catch (error) {
      this.logger?.error(error)
      await transaction.rollback()
      throw error
    }
  }

  publish: (id: string, checker: Checker, user: User) => Promise<Checker> =
    async (id, checker, user) => {
      const transaction = await this.sequelize.transaction()
      const transactionOptions = this.isSqliteFile ? {} : { transaction }

      try {
        const existingChecker = await this.findAndCheckAuth(
          id,
          user,
          transactionOptions
        )
        if (!existingChecker) throw new Error(`Checker ${id} not found`)

        // Check if a published checker already exists. If this is the first publish, set checker isActive to true
        const publishedChecker = await this.PublishedCheckerModel.findOne({
          where: { checkerId: id },
          ...transactionOptions,
        })

        // Perform update in checkers and create in publishedCheckers with 1 transaction
        await this.CheckerModel.update(
          {
            ...checker,
            isActive: publishedChecker ? existingChecker.isActive : true,
          },
          {
            where: { id },
            ...transactionOptions,
          }
        )

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
    user: User,
    transactionOptions?: { transaction?: Transaction }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<(Model<Checker, any> & CheckerWithActive) | null> = async (
    id,
    user,
    transactionOptions = {}
  ) => {
    const checker = await this.CheckerModel.findByPk(id, {
      include: [this.UserModel],
      ...transactionOptions,
    })
    if (checker) {
      const isAuthorized = checker.users?.some((u) => u.id === user.id)
      if (!isAuthorized) {
        throw new Error('Unauthorized')
      }
    }
    return checker
  }

  private findAndCheckAuthOwner: (
    id: string,
    user: User | null,
    transaction?: { transaction?: Transaction }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<(Model<Checker, any> & CheckerWithActive) | null> = async (
    id,
    user,
    transactionOptions
  ) => {
    const checker = await this.CheckerModel.findByPk(id, {
      include: [this.UserModel],
      ...transactionOptions,
    })
    if (checker) {
      const isAuthorized = checker.users?.some(
        // Sequelize automatically adds properties of userToChecker association to user model
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (u) => u.UserToChecker.isOwner && u.id === user?.id
      )
      if (!isAuthorized) {
        throw new Error('Unauthorized')
      }
    }
    return checker
  }

  listCollaborators: (id: string, user: User) => Promise<CollaboratorUser[]> =
    async (id, user) => {
      const checker = await this.findAndCheckAuth(id, user)
      if (checker) {
        // Sequelize automatically adds users property to checker model through association
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return checker.users
      } else return []
    }

  addCollaborator: (
    id: string,
    user: User,
    collaboratorEmail: string
  ) => Promise<void> = async (id, user, collaboratorEmail) => {
    const transaction = await this.sequelize.transaction()
    const options = this.isSqliteFile ? {} : { transaction }

    try {
      const checker = await this.findAndCheckAuth(id, user, options)
      collaboratorEmail = collaboratorEmail.toLowerCase()

      if (checker) {
        const collaboratorUser = await this.UserModel.findOne({
          where: { email: collaboratorEmail },
          ...options,
        })
        // Sequelize automatically adds users property to checker model through association
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (checker.users?.some((u) => u.email === collaboratorEmail))
          throw new Error('User is already a collaborator')
        if (collaboratorUser) {
          await this.UserToCheckerModel.create(
            {
              checkerId: checker.id,
              userId: collaboratorUser.id,
              isOwner: false,
            },
            options
          )
          await transaction.commit()
        } else {
          throw new Error('No such user')
        }
      }
    } catch (error) {
      this.logger?.error(error)
      await transaction.rollback()
      throw error
    }
  }

  deleteCollaborator: (
    id: string,
    user: User,
    collaboratorEmail: string
  ) => Promise<void> = async (id, user, collaboratorEmail) => {
    const transaction = await this.sequelize.transaction()
    const options = this.isSqliteFile ? {} : { transaction }

    try {
      const checker = await this.findAndCheckAuth(id, user, options)
      if (checker) {
        // Sequelize automatically adds users property to user model through association
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const collaborator = checker.users?.find(
          (u: CollaboratorUser) =>
            u.email === collaboratorEmail && !u.UserToChecker.isOwner
        )
        if (!collaborator) throw new Error('Error removing collaborator')
        // Sequelize automatically adds removeUser method to checker model through association
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        else await checker.removeUser(collaborator, options)
        await transaction.commit()
      }
    } catch (error) {
      this.logger?.error(error)
      await transaction.rollback()
      throw error
    }
  }

  update: (
    id: string,
    checker: Partial<Checker>,
    user: User
  ) => Promise<number> = async (id, checker, user) => {
    const c = await this.findAndCheckAuth(id, user)
    if (c) {
      const [count] = await this.CheckerModel.update(
        {
          ...checker,
          isActive: c.isActive,
        },
        {
          where: { id },
        }
      )
      return count
    } else {
      return 0
    }
  }

  setActive: (id: string, user: User, isActive: boolean) => Promise<void> =
    async (id, user, isActive) => {
      const transaction = await this.sequelize.transaction()
      const options = this.isSqliteFile ? {} : { transaction }

      try {
        const checker = await this.findAndCheckAuth(id, user, options)
        if (checker) {
          await this.CheckerModel.update(
            {
              isActive: isActive,
            },
            {
              where: { id: checker.id },
              ...options,
            }
          )
        }
        await transaction.commit()
      } catch (error) {
        this.logger?.error(error)
        await transaction.rollback()
        throw error
      }
    }

  delete: (id: string, user: User) => Promise<number> = async (id, user) => {
    const checker = await this.findAndCheckAuthOwner(id, user)
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
