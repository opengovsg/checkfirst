'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.createTable('usersToCheckers', {
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
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'checkers', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    })
  },

  down: async (queryInterface) => {
    return await queryInterface.dropTable('usersToCheckers')
  },
}
