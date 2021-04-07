import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { Constant, Display, Field, Operation } from '../../../types/checker'
import { Checker } from './Checker'

@Table({ tableName: 'publishedCheckers', timestamps: true })
export class PublishedChecker extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
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
    allowNull: false,
  })
  fields!: Field[]

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  constants!: Constant[]

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  operations!: Operation[]

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  displays!: Display[]

  @ForeignKey(() => Checker)
  @Column
  checkerId!: string

  @BelongsTo(() => Checker)
  checker!: Checker
}
