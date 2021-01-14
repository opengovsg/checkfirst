import Sequelize, { Sequelize as SequelizeInstance } from 'sequelize'
import { IMinimatch } from 'minimatch'

import { ModelOf, Settable } from '.'
import { User } from '../../types/user'

export const init = (
  sequelize: SequelizeInstance,
  options: { emailValidator: IMinimatch }
): ModelOf<User> => <ModelOf<User>>sequelize.define('users', {
    email: {
      type: Sequelize.TEXT,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        isLowercase: true,
        is: options.emailValidator.makeRe(),
      },
      set(this: Settable, email: string) {
        // must save email as lowercase
        this.setDataValue('email', email.trim().toLowerCase())
      },
    },
  })

export default init
