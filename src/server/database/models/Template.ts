import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { Constant, Display, Field, Operation } from '../../../types/checker'

@Table({ tableName: 'templates', timestamps: true })
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
}
