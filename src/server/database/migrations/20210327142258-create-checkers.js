'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('checkers', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      fields: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      constants: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      operations: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      displays: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.dropTable('checkers')
  },
}
