'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('usersToCheckers', {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'checkers', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      checkerId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    return await queryInterface.dropTable('usersToCheckers')
  },
}
