import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './StaticWorkoutPage.module.css';

// Static workout data
const workoutData = {
  arms: {
    title: 'Complete Arm Workout',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop',
    description: 'This comprehensive arm workout targets your biceps, triceps, and forearms to build well-rounded, strong arms. Follow this routine twice per week with at least 48 hours between sessions to allow for proper recovery. Adjust weights as needed to match your fitness level while maintaining proper form.',
    exercises: [
      {
        name: 'Barbell Bicep Curls',
        sets: '3 sets of 10-12 reps',
        instructions: 'Stand with feet shoulder-width apart, holding a barbell with an underhand grip. Keep elbows close to your sides and curl the barbell up toward your shoulders. Lower slowly back to the starting position.'
      },
      {
        name: 'Hammer Curls',
        sets: '3 sets of 12-15 reps',
        instructions: 'Hold dumbbells with palms facing each other. Keep upper arms stationary and curl the weights while maintaining a neutral grip. Focus on squeezing the biceps at the top of the movement.'
      },
      {
        name: 'Tricep Dips',
        sets: '3 sets of 12-15 reps',
        instructions: 'Use parallel bars or a bench. Lower your body by bending your elbows until they reach a 90-degree angle, then push back up to the starting position using your triceps.'
      },
      {
        name: 'Skull Crushers',
        sets: '3 sets of 10-12 reps',
        instructions: 'Lie on a bench holding an EZ bar or dumbbells above your chest. Bend at the elbows to lower the weight toward your forehead, then extend your arms to return to the starting position.'
      },
      {
        name: 'Cable Tricep Pushdowns',
        sets: '3 sets of 12-15 reps',
        instructions: 'Stand in front of a cable machine with a rope or straight bar attachment. Push the attachment down by extending your elbows, keeping your upper arms stationary.'
      },
      {
        name: 'Forearm Reverse Curls',
        sets: '3 sets of 12-15 reps',
        instructions: 'Hold a barbell with an overhand grip. Curl the weight up toward your shoulders while keeping your elbows at your sides. Lower back down with control.'
      },
      {
        name: 'Wrist Curls',
        sets: '3 sets of 15-20 reps',
        instructions: 'Sit on a bench with forearms resting on your thighs and wrists extending beyond your knees. Hold a barbell with palms up, lower the weight by letting your wrists bend, then curl up by flexing your wrists.'
      }
    ],
    tips: [
      'Focus on controlled movements rather than lifting heavy weights',
      'Ensure full range of motion for each exercise',
      'Maintain proper posture throughout your workout',
      'Allow 1-2 minutes of rest between sets',
      'Stay hydrated throughout your training session',
      'Consider a protein-rich meal or shake within 30 minutes after your workout'
    ]
  },
  chest: {
    title: 'Powerful Chest Day',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop',
    description: 'This chest workout focuses on developing both strength and definition across all areas of your pectoral muscles. It incorporates a variety of angles and equipment to ensure complete chest development. Allow 48-72 hours of recovery before training chest again.',
    exercises: [
      {
        name: 'Flat Bench Press',
        sets: '4 sets of 8-10 reps',
        instructions: 'Lie on a flat bench with feet firmly on the ground. Grip the barbell slightly wider than shoulder width. Lower the bar to mid-chest level, then press back up to full arm extension.'
      },
      {
        name: 'Incline Dumbbell Press',
        sets: '3 sets of 10-12 reps',
        instructions: 'Set a bench to a 30-45 degree incline. Hold dumbbells at shoulder level with palms facing forward. Press the weights up until your arms are extended, then lower them back to the starting position.'
      },
      {
        name: 'Decline Push-Ups',
        sets: '3 sets of 12-15 reps',
        instructions: 'Place your feet on a bench or elevated surface with hands on the floor at shoulder width. Lower your chest toward the floor, then push back up to the starting position.'
      },
      {
        name: 'Cable Chest Flyes',
        sets: '3 sets of 12-15 reps',
        instructions: 'Stand between two cable stations set at shoulder height. Grab the handles with arms extended out to your sides. Pull the handles forward and together in an arcing motion, squeezing your chest muscles at the midpoint.'
      },
      {
        name: 'Chest Dips',
        sets: '3 sets of 10-12 reps',
        instructions: 'Use parallel bars, leaning forward slightly to target the chest. Lower your body until your shoulders are below your elbows, then push back up to the starting position.'
      },
      {
        name: 'Push-Up Variations',
        sets: '2 sets of 15 reps each variation',
        instructions: 'Perform standard push-ups, followed by wide-grip push-ups, and diamond push-ups to target different areas of the chest.'
      }
    ],
    tips: [
      'Maintain proper form to prevent shoulder injuries',
      'Focus on squeezing your chest muscles at the top of each movement',
      'Incorporate both pressing and flying movements for complete development',
      'Control the weight on the way down (eccentric phase) for better muscle development',
      'Use a spotter when working with heavy weights on bench press exercises',
      'Gradually increase weight over time to continue challenging your muscles'
    ]
  },
  legs: {
    title: 'Lower Body Strength',
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=1470&auto=format&fit=crop',
    description: 'This comprehensive leg workout targets all major muscle groups in your lower body, including quadriceps, hamstrings, glutes, and calves. This routine is designed to build strength, size, and definition. Due to the intensity, perform this workout once per week to allow for adequate recovery.',
    exercises: [
      {
        name: 'Barbell Back Squats',
        sets: '4 sets of 8-10 reps',
        instructions: 'Place a barbell across your upper back, stand with feet shoulder-width apart. Bend at the knees and hips to lower your body until thighs are parallel to the floor, then push through your heels to return to standing.'
      },
      {
        name: 'Romanian Deadlifts',
        sets: '3 sets of 10-12 reps',
        instructions: 'Hold a barbell in front of your thighs with an overhand grip. Keeping your back straight, hinge at the hips to lower the bar along your legs until you feel a stretch in your hamstrings, then return to the starting position.'
      },
      {
        name: 'Walking Lunges',
        sets: '3 sets of 12 steps per leg',
        instructions: 'Hold dumbbells at your sides, take a step forward and lower your body until both knees are bent at 90-degree angles. Push off your front foot to bring your back foot forward into the next lunge.'
      },
      {
        name: 'Leg Press',
        sets: '3 sets of 12-15 reps',
        instructions: 'Sit in the leg press machine with your feet shoulder-width apart on the platform. Lower the weight by bending your knees until they form 90-degree angles, then push the platform away by extending your legs.'
      },
      {
        name: 'Leg Extensions',
        sets: '3 sets of 12-15 reps',
        instructions: 'Sit in a leg extension machine with the pad on top of your ankles. Extend your legs to lift the weight, pause at the top, then slowly lower back to the starting position.'
      },
      {
        name: 'Lying Leg Curls',
        sets: '3 sets of 12-15 reps',
        instructions: 'Lie face down on a leg curl machine with the pad against your ankles. Curl your legs up by bending at the knees, squeezing your hamstrings at the top, then lower with control.'
      },
      {
        name: 'Standing Calf Raises',
        sets: '4 sets of 15-20 reps',
        instructions: 'Stand on the edge of a step or calf raise machine with the balls of your feet on the edge. Lower your heels below the level of the step, then raise up onto your toes as high as possible.'
      }
    ],
    tips: [
      'Warm up thoroughly to prepare your joints for heavy lifting',
      'Focus on proper form, especially during compound movements like squats and deadlifts',
      'Drive through your heels during squats and lunges to engage your glutes properly',
      'Incorporate a full range of motion to maximize muscle recruitment',
      'Adjust weight based on your current strength level',
      'Allow for longer rest periods (2-3 minutes) between sets of compound exercises',
      'Consider wearing a lifting belt for heavier sets of squats and deadlifts'
    ]
  },
  back: {
    title: 'Complete Back Builder',
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=1470&auto=format&fit=crop',
    description: 'This back workout focuses on developing width, thickness, and overall strength in your entire back. The routine targets the latissimus dorsi, rhomboids, trapezius, and erector spinae muscles. For best results, train your back twice per week with 3-4 days between sessions.',
    exercises: [
      {
        name: 'Pull-Ups/Assisted Pull-Ups',
        sets: '4 sets of 8-10 reps',
        instructions: 'Hang from a pull-up bar with hands slightly wider than shoulder-width apart. Pull your body up until your chin clears the bar, then lower back down with control. Use assistance if needed.'
      },
      {
        name: 'Bent-Over Barbell Rows',
        sets: '3 sets of 10-12 reps',
        instructions: 'Hold a barbell with an overhand grip, bend at the waist with back straight and knees slightly bent. Pull the bar toward your lower ribs, squeezing your shoulder blades together, then lower with control.'
      },
      {
        name: 'Seated Cable Rows',
        sets: '3 sets of 12 reps',
        instructions: 'Sit at a cable row station with feet on the platform and knees slightly bent. Grab the handle, and pull it toward your lower abdomen while keeping your back straight. Return the handle to the starting position with control.'
      },
      {
        name: 'Single-Arm Dumbbell Rows',
        sets: '3 sets of 10-12 reps per arm',
        instructions: 'Place one knee and hand on a bench, with the other foot on the floor. Hold a dumbbell in your free hand, pull it up to your hip while keeping your back flat, then lower it back down.'
      },
      {
        name: 'Lat Pulldowns',
        sets: '3 sets of 12-15 reps',
        instructions: 'Sit at a lat pulldown machine, grip the bar wider than shoulder width. Pull the bar down to your upper chest while keeping your back slightly arched, then slowly return to the starting position.'
      },
      {
        name: 'Face Pulls',
        sets: '3 sets of 15 reps',
        instructions: 'Using a rope attachment on a cable machine set at upper chest height, pull the rope toward your face with elbows high and wide. Focus on squeezing your rear deltoids and mid-back muscles.'
      },
      {
        name: 'Hyperextensions',
        sets: '2 sets of 15 reps',
        instructions: 'Position yourself on a hyperextension bench with your hips on the pad. Cross your arms over your chest or hold a weight plate if needed. Bend at the waist to lower your upper body, then raise back up to a straight position.'
      }
    ],
    tips: [
      'Focus on pulling with your back muscles rather than your arms',
      'Maintain proper posture throughout all exercises to prevent injury',
      'Squeeze your shoulder blades together at the peak of each pulling movement',
      'Use a full range of motion to fully engage all back muscles',
      'Control the weight during both the concentric and eccentric phases',
      'Consider using lifting straps for heavier sets if grip strength is limiting you',
      'Incorporate different grip widths to target various areas of the back'
    ]
  },
  shoulders: {
    title: 'Boulder Shoulder Workout',
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1470&auto=format&fit=crop',
    description: 'This shoulder workout is designed to build well-rounded deltoids by targeting all three heads (anterior, lateral, and posterior). The routine incorporates a variety of movements to ensure complete shoulder development while also engaging the stabilizing muscles. Train shoulders 1-2 times per week with adequate rest between sessions.',
    exercises: [
      {
        name: 'Seated Dumbbell Shoulder Press',
        sets: '4 sets of 8-10 reps',
        instructions: 'Sit on a bench with back support, hold dumbbells at shoulder height with palms facing forward. Press the weights overhead until arms are extended, then lower back to starting position.'
      },
      {
        name: 'Lateral Raises',
        sets: '3 sets of 12-15 reps',
        instructions: 'Stand holding dumbbells at your sides, palms facing in. With a slight bend in your elbows, raise the weights out to the sides until arms are parallel to the floor, then lower slowly.'
      },
      {
        name: 'Front Raises',
        sets: '3 sets of 12 reps',
        instructions: 'Stand holding dumbbells in front of your thighs with palms facing your body. Raise one arm straight in front of you to shoulder height, then lower and repeat with the other arm, alternating sides.'
      },
      {
        name: 'Reverse Flyes',
        sets: '3 sets of 12-15 reps',
        instructions: 'Bend forward at the waist with a flat back, holding dumbbells with palms facing each other. Raise the weights out to the sides by squeezing your shoulder blades together, focusing on the rear deltoids.'
      },
      {
        name: 'Upright Rows',
        sets: '3 sets of 10-12 reps',
        instructions: 'Stand holding a barbell or dumbbells in front of your thighs. Pull the weight up along your body until it reaches upper chest level, leading with your elbows, then lower back down.'
      },
      {
        name: 'Shrugs',
        sets: '3 sets of 15 reps',
        instructions: "Stand holding heavy dumbbells or a barbell at arm's length. Raise your shoulders as high as possible without moving any other body part, hold for a second at the top, then lower back down."
      },
      {
        name: 'Face Pulls',
        sets: '3 sets of 15 reps',
        instructions: 'Set a cable pulley to upper chest height with a rope attachment. Pull the rope towards your face, separating the ends as you pull and focusing on squeezing your rear deltoids.'
      }
    ],
    tips: [
      'Use lighter weights and perfect form to avoid shoulder injuries',
      'Keep your core engaged during standing exercises for better stability',
      'Avoid excessive momentum or swinging during lateral and front raises',
      'Focus on controlled movements rather than heavy weights',
      'Include exercises for all three deltoid heads (front, side, and rear) for balanced development',
      'Consider incorporating rotator cuff exercises to strengthen stabilizing muscles',
      'Maintain proper posture throughout your workout to maximize results and prevent injury'
    ]
  },
  core: {
    title: 'Core Strength & Definition',
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?q=80&w=1470&auto=format&fit=crop',
    description: 'This comprehensive core workout targets all areas of your midsection, including the rectus abdominis, obliques, transverse abdominis, and lower back. The routine combines dynamic and static exercises to build both strength and definition. You can perform this workout 2-3 times per week with at least one day of rest between sessions.',
    exercises: [
      {
        name: 'Plank Variations',
        sets: '3 sets, hold each position for 30-45 seconds',
        instructions: 'Perform standard forearm plank, followed by side planks on each side. Keep your body in a straight line from head to heels, engaging your core throughout the entire hold.'
      },
      {
        name: 'Bicycle Crunches',
        sets: '3 sets of 20 reps (10 per side)',
        instructions: 'Lie on your back with hands behind your head, knees bent. Bring opposite elbow to opposite knee while extending the other leg, alternating sides in a pedaling motion.'
      },
      {
        name: 'Russian Twists',
        sets: '3 sets of 20 reps (10 per side)',
        instructions: 'Sit with knees bent and feet slightly elevated. Lean back slightly, holding a weight or medicine ball with both hands. Rotate your torso to touch the weight to the ground on each side.'
      },
      {
        name: 'Hanging Leg Raises',
        sets: '3 sets of 12-15 reps',
        instructions: 'Hang from a pull-up bar with arms fully extended. Keeping your legs straight, raise them until they form a 90-degree angle with your torso, then lower them with control.'
      },
      {
        name: 'Dead Bug',
        sets: '3 sets of 12 reps per side',
        instructions: 'Lie on your back with arms extended toward the ceiling and knees bent at 90 degrees. Simultaneously lower one arm overhead and extend the opposite leg, keeping your lower back pressed into the floor.'
      },
      {
        name: 'Mountain Climbers',
        sets: '3 sets of 30 seconds',
        instructions: 'Start in a high plank position. Rapidly alternate bringing knees toward your chest in a running motion while maintaining a stable upper body and engaged core.'
      },
      {
        name: 'Ab Rollouts',
        sets: '3 sets of 10-12 reps',
        instructions: 'Kneel on the floor holding an ab wheel or barbell with weight plates. Roll the wheel forward, extending your body as far as possible while keeping your core tight, then use your abs to pull back to the starting position.'
      }
    ],
    tips: [
      'Focus on quality over quantity—proper form is crucial for effective core training',
      'Breathe consistently throughout exercises, exhaling during the most challenging part',
      'Engage your core by drawing your navel toward your spine during all exercises',
      'Progress gradually by increasing hold times for static exercises and reps for dynamic movements',
      'Include exercises that target all areas of your core for balanced development',
      'Remember that visible abs are largely dependent on low body fat percentage, so combine training with proper nutrition',
      'Incorporate both anti-extension and anti-rotation exercises for functional core strength'
    ]
  }
};

const StaticWorkoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    
    if (workoutData[id]) {
      setWorkout(workoutData[id]);
    }
  }, [id]);

  if (!workout) {
    return (
      <div className={styles.container}>
        <p className={styles.errorText}>Workout not found. Please try a different workout.</p>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{workout.title}</h1>
      
      <div className={styles.imageContainer}>
        <img src={workout.image} alt={workout.title} className={styles.workoutImage} />
      </div>
      
      <div className={styles.infoSection}>
        <p className={styles.description}>{workout.description}</p>
        
        <h2 className={styles.sectionTitle}>Exercise Routine</h2>
        <div className={styles.exercisesList}>
          {workout.exercises.map((exercise, index) => (
            <div key={index} className={styles.exerciseCard}>
              <h3 className={styles.exerciseName}>{exercise.name}</h3>
              <p className={styles.exerciseSets}><span className={styles.boldText}>Sets/Reps:</span> {exercise.sets}</p>
              <p className={styles.exerciseInstructions}>{exercise.instructions}</p>
            </div>
          ))}
        </div>
        
        <h2 className={styles.sectionTitle}>Pro Tips</h2>
        <ul className={styles.tipsList}>
          {workout.tips.map((tip, index) => (
            <li key={index} className={styles.tipItem}>{tip}</li>
          ))}
        </ul>
      </div>
      
      <button className={styles.backButton} onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};

export default StaticWorkoutPage;