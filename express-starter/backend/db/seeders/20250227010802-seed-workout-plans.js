'use strict';


let options = { tableName: 'WorkoutPlans' }; // Always define tableName
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('WorkoutPlans', [
      {
        user_id: 1,
        title: 'Full Body Strength Training',
        description: 'A 4-week full-body strength program designed to target all major muscle groups. The program focuses on compound exercises, such as squats, deadlifts, and bench presses, to build overall strength. Over the course of four weeks, the intensity and volume of the workouts will increase gradually, ensuring progressive overload for muscle growth.\n\nIn this plan, each workout is carefully structured to optimize recovery between training days. You will focus on one or two major lifts per day, supplemented with accessory movements to target smaller muscle groups. Whether you\'re a beginner or an intermediate lifter, this program will help you gain muscle and increase strength over time.',
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
        image_url_1: 'https://www.dmarge.com/wp-content/uploads/2024/01/Sam-Suleks-Age.jpg',
        image_url_2: 'https://i1.sndcdn.com/artworks-Bl33LkAkZyCqLMUx-Hdq7LQ-t500x500.jpg',
        created_at: new Date()
      },
      {
        user_id: 2,
        title: 'Fat Loss & Conditioning',
        description: 'A high-intensity 5-day fat-burning plan designed to maximize fat loss while improving cardiovascular conditioning. This plan includes a mix of HIIT (High-Intensity Interval Training), resistance training, and plyometric movements that will help you shed fat while increasing stamina and endurance.\n\nEach week focuses on targeting different energy systems, helping you burn fat effectively. The workouts vary in intensity, ensuring that you avoid plateauing while continually challenging your body to adapt. This plan is ideal for individuals looking to lose weight quickly while building lean muscle mass.',
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
        image_url_1: 'https://qph.cf2.quoracdn.net/main-qimg-ab9bae893b32911c8981c6d3908b636b-lq',
        image_url_2: 'https://www.hustlerfitness.com/cdn/shop/products/GETSHREDDEDWORKOUT.png?v=1571470934',
        created_at: new Date()
      },
      {
        user_id: 3,
        title: 'Powerlifting 3-Day Split',
        description: 'A strength-focused powerlifting program that emphasizes the three major powerlifting movements: squat, bench press, and deadlift. This program is perfect for those who are interested in improving their one-rep max and building raw strength. Over three days per week, you will focus on heavy lifting with accessory exercises that complement the main lifts and build muscle in key areas.\n\nThe Powerlifting 3-Day Split is structured to allow maximum recovery between sessions, ensuring that you can lift heavier weights safely and effectively. This program is ideal for intermediate to advanced lifters who are already familiar with the basics of strength training and are looking to push their limits.',
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
        image_url_1: 'https://www.thedailybeast.com/resizer/T6aOxYAOgaPQEBs80-a3pkWbKeU=/arc-photo-thedailybeast/arc2-prod/public/THM7UWZCJNPL7D3E7UILWJKV5M.jpg',
        image_url_2: 'https://qph.cf2.quoracdn.net/main-qimg-6dda05f0ee8ffeccd5b9435f8a05f834-pjlq',
        created_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('WorkoutPlans', null, {});
  }
};
