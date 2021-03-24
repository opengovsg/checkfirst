import Sequelize, { Sequelize as SequelizeInstance } from 'sequelize'

import { ModelOf } from '.'
import { Template } from '../../types/template'

export const init = (sequelize: SequelizeInstance): ModelOf<Template> =>
  <ModelOf<Template>>sequelize.define('template', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
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
