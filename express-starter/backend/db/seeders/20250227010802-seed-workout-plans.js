'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('WorkoutPlans', [
      {
        user_id: 1,  // Ensure this is an integer
        title: 'Full Body Strength Training',
        description: 'A 4-week full-body strength program.',
        goal: 'Gain Muscle',
        training_days_per_week: 4,
        plan_details: JSON.stringify({
          week1: {
            Monday: ['Squats', 'Bench Press'],
            Wednesday: ['Deadlifts', 'Pull-ups'],
            Friday: ['Leg Press', 'Dips'],
            Sunday: ['Rows', 'Overhead Press']
          },
          week2: {
            Monday: ['Front Squats', 'Incline Bench Press'],
            Wednesday: ['Romanian Deadlifts', 'Chin-ups'],
            Friday: ['Bulgarian Split Squats', 'Triceps Dips'],
            Sunday: ['Barbell Rows', 'Military Press']
          }
        }),
        likes: 15,
        created_at: new Date()
      },
      {
        user_id: 2,
        title: 'Fat Loss & Conditioning',
        description: 'A high-intensity 5-day fat-burning plan.',
        goal: 'Lose Weight',
        training_days_per_week: 5,
        plan_details: JSON.stringify({
          week1: {
            Monday: ['Jump Rope', 'Burpees', 'Mountain Climbers'],
            Tuesday: ['Treadmill Sprints', 'Planks', 'Jump Squats'],
            Thursday: ['Cycling', 'Russian Twists', 'Push-ups'],
            Saturday: ['Kettlebell Swings', 'Box Jumps', 'Battle Ropes'],
            Sunday: ['Rowing Machine', 'Jump Lunges', 'Jump Rope']
          },
          week2: {
            Monday: ['Treadmill Intervals', 'Jump Lunges', 'Plank Holds'],
            Tuesday: ['Boxing Drills', 'Kettlebell Snatches', 'Sit-ups'],
            Thursday: ['Jump Rope', 'Jump Squats', 'Push-ups'],
            Saturday: ['Rowing Machine', 'Russian Twists', 'Plank Jacks'],
            Sunday: ['Cycling', 'Jump Lunges', 'Burpees']
          }
        }),
        likes: 30,
        created_at: new Date()
      },
      {
        user_id: 3,
        title: 'Powerlifting 3-Day Split',
        description: 'A strength-focused powerlifting program.',
        goal: 'Gain Muscle',
        training_days_per_week: 3,
        plan_details: JSON.stringify({
          week1: {
            Monday: ['Squat', 'Leg Press', 'Calf Raises'],
            Wednesday: ['Bench Press', 'Incline Dumbbell Press', 'Triceps Extensions'],
            Friday: ['Deadlifts', 'Barbell Rows', 'Face Pulls']
          },
          week2: {
            Monday: ['Box Squats', 'Leg Curls', 'Standing Calf Raises'],
            Wednesday: ['Close-Grip Bench Press', 'Dumbbell Flys', 'Overhead Triceps Extensions'],
            Friday: ['Sumo Deadlifts', 'Seated Rows', 'Rear Delt Flys']
          }
        }),
        likes: 25,
        created_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('WorkoutPlans', null, {});
  }
};
