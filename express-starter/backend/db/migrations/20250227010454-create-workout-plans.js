'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WorkoutPlans', {
      id: {
        allowNull: false,
        autoIncrement: true,  // Enable auto-increment
        primaryKey: true,
        type: Sequelize.INTEGER  // Change from UUID to INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,  // Ensure user_id matches the Users table
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      goal: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      training_days_per_week: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      plan_details: {
        type: Sequelize.JSON,
        allowNull: false
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      // Adding two image URL fields
      image_url_1: {
        type: Sequelize.STRING, // URL as a string
        allowNull: true // Allow this to be optional
      },
      image_url_2: {
        type: Sequelize.STRING, // URL as a string
        allowNull: true // Allow this to be optional
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WorkoutPlans');
  }
};
