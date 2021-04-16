import {
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { Checker } from './Checker'
import { User } from './User'

@Table({ tableName: 'usersToCheckers' })
export class UserToChecker extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number

  @ForeignKey(() => Checker)
  @Column
  checkerId!: string

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date
}
