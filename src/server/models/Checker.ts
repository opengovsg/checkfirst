import Sequelize, { Sequelize as SequelizeInstance } from 'sequelize'

import { ModelOf } from '.'
import { Checker } from '../../types/checker'

export const init = (sequelize: SequelizeInstance): ModelOf<Checker> =>
  <ModelOf<Checker>>sequelize.define('checkers', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      validate: {
        is: /^[a-z0-9-]+$/,
      },
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    fields: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    constants: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    operations: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    displays: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  })

export default init
