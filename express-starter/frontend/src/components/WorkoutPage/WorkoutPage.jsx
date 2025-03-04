import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { csrfFetch } from '../../redux/csrf'; // Import csrfFetch
import './WorkoutPage.css'; // Link to the WorkoutPage CSS file

const WorkoutPage = () => {
  const { id } = useParams(); // Get the workout ID from the URL params
  const [workoutPlan, setWorkoutPlan] = useState(null); // Local state for the workout plan
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await csrfFetch(`/api/workoutPlans/${id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkoutPlan(data); // Set workout plan to state
        } else {
          throw new Error('Failed to fetch the workout plan');
        }
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchWorkoutPlan(); // Call the fetch function when the component mounts
  }, [id]);

  if (loading) return <p>Loading workout plan...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!workoutPlan) return <p>No workout plan found.</p>;

  return (
    <div className="workout-page-container">
      <h1 className="workout-title">{workoutPlan.title}</h1>
      
      <div className="workout-images">
        {workoutPlan.image_url_1 && <img src={workoutPlan.image_url_1} alt="Workout" className="workout-image" />}
        {workoutPlan.image_url_2 && <img src={workoutPlan.image_url_2} alt="Workout" className="workout-image" />}
      </div>
  
      <div className="workout-info">
        <p className="workout-description">{workoutPlan.description}</p>
        <p><strong>Goal:</strong> {workoutPlan.goal}</p>
        <p><strong>Training Days Per Week:</strong> {workoutPlan.training_days_per_week}</p>
  
        <h3>Workout Plan Details:</h3>
        <div className="workout-plan-details">
          {workoutPlan.plan_details && Object.keys(workoutPlan.plan_details).map((week) => (
            <div key={week} className="week-details">
              <h4>{week.charAt(0).toUpperCase() + week.slice(1)}</h4>
              <div className="day-details">
                {Object.keys(workoutPlan.plan_details[week]).map((day) => (
                  <div key={day} className="day">
                    <h5>{day}</h5>
                    <ul>
                      {workoutPlan.plan_details[week][day].map((exercise, index) => (
                        <li key={index}>{exercise}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
  
      {/* Button to Create Workout */}
      <div className="create-workout-container">
        <button className="create-workout-btn" onClick={() => window.location.href = '/create-workout'}>
          Create Your Own Workout Plan
        </button>
      </div>
    </div>
  );  
};

export default WorkoutPage;
