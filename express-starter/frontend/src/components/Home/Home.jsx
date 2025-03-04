import { useEffect, useState } from 'react';
import { csrfFetch } from '../../redux/csrf'; // Import csrfFetch
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Home.css'; // Link to your CSS file

const Home = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]); // Local state for workout plans
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const response = await csrfFetch('/api/workoutPlans');
        
        if (response.ok) {
          const data = await response.json();
          setWorkoutPlans(data); // Set workout plans to state
        } else {
          throw new Error('Failed to fetch workout plans');
        }
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchWorkoutPlans(); // Call the fetch function when the component mounts
  }, []);

  // Helper function to extract the first sentence from the description
  const getFirstSentence = (description) => {
    const firstSentence = description.split('.')[0]; // Split by the first period and get the first sentence
    return firstSentence + (firstSentence ? '.' : ''); // Ensure the sentence ends with a period
  };

  return (
    <div className="home-container">
      <h1 className="title">Workout Plans</h1>
      <div className="workout-plans-container">
        {loading && <p className="loading-text">Loading workout plans...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && workoutPlans.length > 0 ? (
          <div className="workout-cards">
            {workoutPlans.map((plan) => (
              <div key={plan.id} className="workout-card">
                {/* Display only the first image */}
                <img src={plan.image_url_1} alt={plan.title} className="workout-image" />
                <div className="workout-info">
                  <h3 className="workout-title">{plan.title}</h3>
                  {/* Display only the first sentence of the description */}
                  <p className="workout-description">{getFirstSentence(plan.description)}</p>
                  <p><strong>Goal:</strong> {plan.goal}</p>
                  {/* Add a link to navigate to the workout plan page */}
                  <Link to={`/workout/${plan.id}`} className="workout-url">View Full Plan</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No workout plans available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
