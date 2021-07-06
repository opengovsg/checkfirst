'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usersToCheckers', 'isOwner', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    })
  },

  down: async (queryInterface, _) => {
    // return queryInterface
    //   .bulkDelete('usersToCheckers', { isOwner: false })
    //   .then(() => {
    //     queryInterface.removeColumn('usersToCheckers', 'isOwner')
    //   })
    return queryInterface.removeColumn('usersToCheckers', 'isOwner')
  },
}
