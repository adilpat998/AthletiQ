'use strict';

const {User, Sequelize} = require('../models');
const bcrypt = require('bcryptjs');


let options = { tableName: 'Users' }; // Always define tableName
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, [
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password', bcrypt.genSaltSync(10)),
        profileImg: ''
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2', bcrypt.genSaltSync(10)),
        profileImg: ''
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3', bcrypt.genSaltSync(10)),
        profileImg: ''
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] } // Ensure correct deletion
    }, {});
  }
};