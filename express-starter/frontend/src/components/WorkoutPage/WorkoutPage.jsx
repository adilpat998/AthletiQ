import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector
import { csrfFetch } from '../../redux/csrf'; 
import './WorkoutPage.css'; 

const WorkoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // For redirecting after delete
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector(state => state.session.user); // Get logged-in user

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await csrfFetch(`/api/workoutPlans/${id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkoutPlan(data);
        } else {
          throw new Error('Failed to fetch the workout plan');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workout plan?')) return;
  
    try {
      const response = await csrfFetch(`/api/workoutPlans/${id}`, { method: 'DELETE' });
  
      if (response.ok) {
        navigate('/'); // Redirect to home page after deletion
      } else {
        throw new Error('Failed to delete the workout plan.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

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

      {/* Show Delete and Edit Button if the logged-in user owns the workout plan */}
      {currentUser && currentUser.id === workoutPlan.user_id && (
        <>
          <button className="edit-workout-btn" onClick={() => navigate(`/edit-workout/${id}`)}>
            Edit Workout Plan
          </button>
          <button className="delete-workout-btn" onClick={handleDelete}>
            Delete Workout Plan
          </button>
        </>
      )}

      <div className="create-workout-container">
        <button className="create-workout-btn" onClick={() => navigate('/create-workout')}>
          Create Your Own Workout Plan
        </button>
      </div>
    </div>
  );  
};

export default WorkoutPage;
