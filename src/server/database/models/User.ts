import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript'
import minimatch from 'minimatch'

import config from '../../config'
import { Checker } from './Checker'
import { UserToChecker } from './UserToChecker'

const mailSuffix = config.get('mailSuffix')
const emailValidator = new minimatch.Minimatch(mailSuffix, {
  noext: true,
  noglobstar: true,
  nobrace: true,
  nonegate: true,
})

interface Settable {
  setDataValue(key: string, value: unknown): void
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  id!: number

  @Column({
    type: DataType.TEXT,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      isLowercase: true,
      is: emailValidator.makeRe(),
    },
    set(this: Settable, email: string) {
      // must save email as lowercase
      this.setDataValue('email', email.trim().toLowerCase())
    },
  })
  email!: string

  @BelongsToMany(() => Checker, () => UserToChecker)
  checkers!: Checker[]
}
