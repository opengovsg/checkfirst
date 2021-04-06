'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('templates', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      description: {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.dropTable('templates')
  },
}
