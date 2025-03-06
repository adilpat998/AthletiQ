'use strict';

let options = { tableName: 'Reviews' }; // Always define tableName
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Reviews', [
      {
        workout_id: 3, 
        user_id: 2,     
        rating: 5,
        comment: 'Amazing full-body workout plan! Really helped me gain muscle!',
        created_at: new Date(),
      },
      {
        workout_id: 2,  
        user_id: 1,     
        rating: 4,
        comment: 'Good fat loss program. I would recommend it.',
        created_at: new Date(),
      },
      {
        workout_id: 1, 
        user_id: 3,    
        rating: 3,
        comment: 'Decent powerlifting plan, but could use more variation.',
        created_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  },
};
