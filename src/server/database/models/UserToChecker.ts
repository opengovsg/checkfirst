import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'

import { Checker } from './Checker'
import { User } from './User'

@Table({ tableName: 'usersToCheckers', timestamps: true })
export class UserToChecker extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number

  @ForeignKey(() => Checker)
  @Column
  checkerId!: string
}
