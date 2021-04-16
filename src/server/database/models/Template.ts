import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Constant, Display, Field, Operation } from '../../../types/checker'

@Table({ tableName: 'templates' })
export class Template extends Model {
  @Column({
    primaryKey: true,
    type: DataType.STRING,
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

  @CreatedAt
  createdAt!: Date

  @UpdatedAt
  updatedAt!: Date
}
