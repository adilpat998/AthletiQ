'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // Define schema in options if in production
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {  // 'Users' should be explicitly passed
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(256),
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY,
        allowNull: false
      },
      profileImg: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: ""
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options); // Pass options as the third argument
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users', options); // Ensure correct table name
  }
};
