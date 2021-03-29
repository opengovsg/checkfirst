import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript'

import { Constant, Display, Field, Operation } from '../../../types/checker'
import { User } from './User'
import { UserToChecker } from './UserToChecker'

@Table({ tableName: 'checkers', timestamps: true })
export class Checker extends Model<Checker> {
  @Column({
    primaryKey: true,
    type: DataType.STRING,
    validate: {
      is: /^[a-z0-9-]+$/,
    },
  })
  id!: string

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  title!: string

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  fields!: Field[]

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  constants!: Constant[]

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  operations!: Operation[]

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  displays!: Display[]

  @BelongsToMany(() => User, () => UserToChecker)
  users!: User[]
}
