'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('checkers', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    })
  },

  down: async (queryInterface, _) => {
    return queryInterface.removeColumn('checkers', 'isActive')
  },
}
