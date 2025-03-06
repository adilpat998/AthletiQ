import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { csrfFetch } from '../../redux/csrf'; // Import the csrfFetch function
import './CreateWorkoutPage.css';

const CreateWorkoutPage = () => {
  const [numWeeks, setNumWeeks] = useState(1);
  const [planDetails, setPlanDetails] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] = useState(1);
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(''); 

  const navigate = useNavigate();

  const handleWeekChange = (e, weekIndex, day) => {
    const { value } = e.target;
    setPlanDetails(prev => ({
      ...prev,
      [weekIndex]: {
        ...prev[weekIndex],
        [day]: value.split(',').map(exercise => exercise.trim()) || []
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const workoutPlan = {
      title,
      description,
      goal,
      training_days_per_week: trainingDaysPerWeek,
      plan_details: planDetails,
      image_url_1: imageUrl1,
      image_url_2: imageUrl2,
    };

    try {
      const response = await csrfFetch('/api/workoutPlans', {
        method: 'POST',
        body: JSON.stringify(workoutPlan),
      });

      if (response.ok) {
        const data = await response.json(); 
        const newPlanId = data.id; 

        // Redirect immediately after successful creation
        navigate(`/workout/${newPlanId}`);

        // Clear the form after successful submission
        setTitle('');
        setDescription('');
        setGoal('');
        setTrainingDaysPerWeek(1);
        setNumWeeks(1);
        setPlanDetails({});
        setImageUrl1('');
        setImageUrl2('');
      } else {
        const errorData = await response.json();
        setError(errorData.errors || 'Error creating workout plan'); 
      }
    } catch (err) {
      // Handle errors (e.g., network issues)
      setError('Error creating workout plan');
      console.error('Error creating workout plan', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderWeeks = () => {
    const weeks = [];
    for (let i = 1; i <= numWeeks; i++) {
      const weekIndex = `week${i}`;
      weeks.push(
        <div key={weekIndex} className="week-container">
          <h3>Week {i}</h3>
          {['Monday', 'Wednesday', 'Friday'].slice(0, trainingDaysPerWeek).map((day, dayIndex) => (
            <div key={dayIndex} className="exercise-entry">
              <label htmlFor={`week-${i}-day-${day}`}>{day}</label>
              <textarea
                id={`week-${i}-day-${day}`}
                name={day}
                value={(planDetails[weekIndex] && planDetails[weekIndex][day]) || ''}
                onChange={(e) => handleWeekChange(e, weekIndex, day)}
                placeholder="Enter exercises (comma separated)"
              />
            </div>
          ))}
        </div>
      );
    }
    return weeks;
  };

  return (
    <div className="create-workout-container">
      <h1>Create a New Workout Plan</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />

        <label>Description:</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />

        <label>Goal:</label>
        <input 
          type="text" 
          value={goal} 
          onChange={(e) => setGoal(e.target.value)} 
          required 
        />

        <div className="flex-inputs">
          <div>
            <label>Training Days Per Week:</label>
            <input 
              type="number" 
              value={trainingDaysPerWeek} 
              onChange={(e) => setTrainingDaysPerWeek(Number(e.target.value))} 
              min="1" 
              max="3" 
            />
          </div>

          <div>
            <label>How many weeks for the plan?</label>
            <input 
              type="number" 
              value={numWeeks} 
              onChange={(e) => setNumWeeks(Number(e.target.value))} 
              min="1" 
              max="4" 
            />
          </div>
        </div>

        {renderWeeks()}

        <label>Image URL 1:</label>
        <input 
          type="url" 
          value={imageUrl1} 
          onChange={(e) => setImageUrl1(e.target.value)} 
        />

        <label>Image URL 2:</label>
        <input 
          type="url" 
          value={imageUrl2} 
          onChange={(e) => setImageUrl2(e.target.value)} 
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Workout Plan'}
        </button>
      </form>

      {/* Display error message if there's one */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateWorkoutPage;
