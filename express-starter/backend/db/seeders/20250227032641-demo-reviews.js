'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Reviews', [
      {
        workout_id: 3,  // Replace with actual workout plan ID (integer)
        user_id: 2,     // Replace with actual user ID (integer)
        rating: 5,
        comment: 'Amazing full-body workout plan! Really helped me gain muscle!',
        created_at: new Date(),
      },
      {
        workout_id: 2,  // Replace with actual workout plan ID (integer)
        user_id: 1,     // Replace with actual user ID (integer)
        rating: 4,
        comment: 'Good fat loss program. I would recommend it.',
        created_at: new Date(),
      },
      {
        workout_id: 1,  // Replace with actual workout plan ID (integer)
        user_id: 3,     // Replace with actual user ID (integer)
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
