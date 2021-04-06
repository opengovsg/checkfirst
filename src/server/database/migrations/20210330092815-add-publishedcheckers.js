'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('publishedCheckers', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      title: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      description: {
        allowNull: true,
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
      checkerId: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: 'checkers', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.dropTable('publishedCheckers')
  },
}
