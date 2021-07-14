'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkers', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })

    const query =
      'UPDATE checkers ' +
      'SET "isActive" = EXISTS( SELECT 1 FROM checkers as c1, "publishedCheckers" as pc1 ' +
      'WHERE c1.id = pc1."checkerId" ' +
      'AND checkers.id = pc1."checkerId")'
    await queryInterface.sequelize.query(query, {
      raw: true,
    })
  },

  down: async (queryInterface, _) => {
    return queryInterface.removeColumn('checkers', 'isActive')
  },
}
