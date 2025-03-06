import { useEffect, useState } from 'react';
import { csrfFetch } from '../../redux/csrf';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

// Static workout data
const staticWorkouts = [
  {
    id: 'arms',
    title: 'Complete Arm Workout',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop',
    description: 'Build bigger, stronger arms with this comprehensive biceps, triceps, and forearms routine.',
    targetMuscles: 'Biceps, Triceps, Forearms'
  },
  {
    id: 'chest',
    title: 'Powerful Chest Day',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop',
    description: 'Sculpt and strengthen your chest with this effective pectoral workout.',
    targetMuscles: 'Pectoralis Major, Pectoralis Minor'
  },
  {
    id: 'legs',
    title: 'Lower Body Strength',
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?q=80&w=1470&auto=format&fit=crop',
    description: 'Build powerful legs and glutes with this comprehensive lower body routine.',
    targetMuscles: 'Quadriceps, Hamstrings, Glutes, Calves'
  },
  {
    id: 'back',
    title: 'Complete Back Builder',
    image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=1470&auto=format&fit=crop',
    description: 'Develop a stronger, wider back with this targeted lat and upper back workout.',
    targetMuscles: 'Latissimus Dorsi, Rhomboids, Trapezius'
  },
  {
    id: 'shoulders',
    title: 'Boulder Shoulder Workout',
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1470&auto=format&fit=crop',
    description: 'Build impressive, well-rounded shoulders with this deltoid-focused routine.',
    targetMuscles: 'Anterior, Lateral, and Posterior Deltoids'
  },
  {
    id: 'core',
    title: 'Core Strength & Definition',
    image: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?q=80&w=1470&auto=format&fit=crop',
    description: 'Strengthen your core and build defined abs with this targeted midsection workout.',
    targetMuscles: 'Abs, Obliques, Lower Back'
  }
];

const Home = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const response = await csrfFetch('/api/workoutPlans');
        
        if (response.ok) {
          const data = await response.json();
          setWorkoutPlans(data);
        } else {
          throw new Error('Failed to fetch workout plans');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
  }, []);

  // Helper function to extract the first sentence from the description
  const getFirstSentence = (description) => {
    const firstSentence = description.split('.')[0];
    return firstSentence + (firstSentence ? '.' : '');
  };

  return (
    <div className={styles.container}>
      {/* User Created Workout Plans Section */}
      <h1 className={styles.title}>Workout Plans</h1>
      <div className={styles.plansContainer}>
        {loading && <p className={styles.loadingText}>Loading workout plans...</p>}
        {error && <p className={styles.errorText}>{error}</p>}
        {!loading && !error && workoutPlans.length > 0 ? (
          <div className={styles.cards}>
            {workoutPlans.map((plan) => (
              <div key={plan.id} className={styles.card}>
                <div className={styles.cardImageContainer}>
                  <img src={plan.image_url_1} alt={plan.title} className={styles.cardImage} />
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardTitle}>{plan.title}</h3>
                  <p className={styles.cardDescription}>{getFirstSentence(plan.description)}</p>
                  <p><span className={styles.boldText}>Goal:</span> {plan.goal}</p>
                  <Link to={`/workout/${plan.id}`} className={styles.cardLink}>View Full Plan</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No workout plans available.</p>
        )}
      </div>

      {/* Static Workout Section */}
      <h1 className={`${styles.title} ${styles.staticWorkoutsTitle}`}>Targeted Workouts</h1>
      <div className={styles.plansContainer}>
        <div className={styles.cards}>
          {staticWorkouts.map((workout) => (
            <div key={workout.id} className={styles.card}>
              <div className={styles.cardImageContainer}>
                <img src={workout.image} alt={workout.title} className={styles.cardImage} />
              </div>
              <div className={styles.cardInfo}>
                <h3 className={styles.cardTitle}>{workout.title}</h3>
                <p className={styles.cardDescription}>{workout.description}</p>
                <p><span className={styles.boldText}>Target:</span> {workout.targetMuscles}</p>
                <Link to={`/static-workout/${workout.id}`} className={styles.cardLink}>View Workout</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;