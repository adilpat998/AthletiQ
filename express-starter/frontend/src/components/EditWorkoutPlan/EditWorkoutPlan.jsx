import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { csrfFetch } from '../../redux/csrf';
import './EditWorkoutPlan.css';

const EditWorkoutPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState({
    title: '',
    description: '',
    goal: '',
    training_days_per_week: 1,
    plan_details: {},
    image_url_1: '',
    image_url_2: '',
  });
  const [numWeeks, setNumWeeks] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await csrfFetch(`/api/workoutPlans/${id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkoutPlan(data);
          setNumWeeks(Object.keys(data.plan_details).length || 1);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeekChange = (e, weekIndex, day) => {
    const { value } = e.target;
    setWorkoutPlan((prev) => ({
      ...prev,
      plan_details: {
        ...prev.plan_details,
        [weekIndex]: {
          ...prev.plan_details[weekIndex],
          [day]: value.split(',').map((exercise) => exercise.trim()) || [],
        },
      },
    }));
  };

  const handleNumWeeksChange = (e) => {
    const newNumWeeks = Number(e.target.value);
    setNumWeeks(newNumWeeks);

    // Trim plan details to match the new number of weeks
    setWorkoutPlan((prev) => {
      const updatedPlanDetails = { ...prev.plan_details };
      if (newNumWeeks < Object.keys(updatedPlanDetails).length) {
        Object.keys(updatedPlanDetails)
          .slice(newNumWeeks)
          .forEach((week) => delete updatedPlanDetails[week]);
      }
      return {
        ...prev,
        plan_details: updatedPlanDetails,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await csrfFetch(`/api/workoutPlans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(workoutPlan),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        navigate(`/workout/${id}`); // Redirect to the workout plan page after editing
      } else {
        throw new Error('Failed to update workout plan');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const renderWeeks = () => {
    const weeks = [];
    for (let i = 1; i <= numWeeks; i++) {
      const weekIndex = `week${i}`;
      weeks.push(
        <div key={weekIndex} className="week-container">
          <h3>Week {i}</h3>
          {['Monday', 'Wednesday', 'Friday']
            .slice(0, workoutPlan.training_days_per_week)
            .map((day, dayIndex) => (
              <div key={dayIndex} className="exercise-entry">
                <label htmlFor={`week-${i}-day-${day}`}>{day}</label>
                <textarea
                  id={`week-${i}-day-${day}`}
                  name={day}
                  value={(workoutPlan.plan_details[weekIndex] && workoutPlan.plan_details[weekIndex][day]) || ''}
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

  if (loading) return <p>Loading workout plan...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="edit-workout-plan-container">
      <h1>Edit Workout Plan</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={workoutPlan.title}
          onChange={handleChange}
          placeholder="Title"
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={workoutPlan.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <label>Goal:</label>
        <input
          type="text"
          name="goal"
          value={workoutPlan.goal}
          onChange={handleChange}
          placeholder="Goal"
        />

        <div className="flex-inputs">
          <div>
            <label>Training Days Per Week:</label>
            <input
              type="number"
              name="training_days_per_week"
              value={workoutPlan.training_days_per_week}
              onChange={handleChange}
              min="1"
              max="3"
            />
          </div>

          <div>
            <label>How many weeks for the plan?</label>
            <input
              type="number"
              value={numWeeks}
              onChange={handleNumWeeksChange}
              min="1"
              max="4"
            />
          </div>
        </div>

        {renderWeeks()}

        <label>Image URL 1:</label>
        <input
          type="url"
          name="image_url_1"
          value={workoutPlan.image_url_1}
          onChange={handleChange}
        />

        <label>Image URL 2:</label>
        <input
          type="url"
          name="image_url_2"
          value={workoutPlan.image_url_2}
          onChange={handleChange}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditWorkoutPlan;
