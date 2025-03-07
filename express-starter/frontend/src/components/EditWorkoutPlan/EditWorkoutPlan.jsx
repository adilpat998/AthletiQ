import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  
  // For debouncing
  const updateTimeoutRef = useRef(null);
  const prevTrainingDaysRef = useRef(1);
  const prevNumWeeksRef = useRef(1);

  // Fetch workout plan data
  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await csrfFetch(`/api/workoutPlans/${id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkoutPlan(data);
          
          // Determine number of weeks from plan_details
          const weekKeys = Object.keys(data.plan_details || {}).filter(key => key.startsWith('week'));
          const weeksCount = weekKeys.length || 1;
          setNumWeeks(weeksCount);
          
          // Store initial values for comparison
          prevTrainingDaysRef.current = data.training_days_per_week || 1;
          prevNumWeeksRef.current = weeksCount;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch the workout plan');
        }
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [id]);

  // Optimize plan_details structure updates with useMemo and a check for actual changes
  useEffect(() => {
    if (loading) return; // Skip during initial load
    
    // Check if values actually changed to avoid unnecessary updates
    if (prevTrainingDaysRef.current === workoutPlan.training_days_per_week && 
        prevNumWeeksRef.current === numWeeks) {
      return;
    }
    
    // Update refs with current values
    prevTrainingDaysRef.current = workoutPlan.training_days_per_week;
    prevNumWeeksRef.current = numWeeks;
    
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Debounce the update to prevent excessive re-renders
    updateTimeoutRef.current = setTimeout(() => {
      setWorkoutPlan(prev => {
        const updatedPlanDetails = { ...prev.plan_details };
        
        // Initialize or update weeks
        for (let i = 1; i <= numWeeks; i++) {
          const weekIndex = `week${i}`;
          
          if (!updatedPlanDetails[weekIndex]) {
            updatedPlanDetails[weekIndex] = {};
          }
          
          // Make sure each week has the correct days based on training_days_per_week
          const days = ['Monday', 'Wednesday', 'Friday'].slice(0, prev.training_days_per_week);
          
          days.forEach(day => {
            if (!updatedPlanDetails[weekIndex][day]) {
              updatedPlanDetails[weekIndex][day] = [];
            }
          });
        }
        
        // Remove extra weeks if numWeeks was reduced
        Object.keys(updatedPlanDetails)
          .filter(key => key.startsWith('week'))
          .forEach(weekKey => {
            const weekNum = parseInt(weekKey.replace('week', ''));
            if (weekNum > numWeeks) {
              delete updatedPlanDetails[weekKey];
            }
          });
        
        return {
          ...prev,
          plan_details: updatedPlanDetails
        };
      });
    }, 300); // 300ms debounce
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [numWeeks, workoutPlan.training_days_per_week, loading]);

  // Memoized validation function with enhanced requirements
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Enhanced Title validation - minimum 3 characters
    if (!workoutPlan.title) {
      newErrors.title = 'Title is required';
    } else if (workoutPlan.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (workoutPlan.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Enhanced Description validation - minimum 10 characters
    if (!workoutPlan.description) {
      newErrors.description = 'Description is required';
    } else if (workoutPlan.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long - provide details about this workout';
    }
    
    // Enhanced Goal validation - minimum 5 characters
    if (!workoutPlan.goal) {
      newErrors.goal = 'Goal is required';
    } else if (workoutPlan.goal.trim().length < 5) {
      newErrors.goal = 'Goal must be at least 5 characters long - be specific about what this workout helps achieve';
    }
    
    // Validate training days
    if (workoutPlan.training_days_per_week < 1 || workoutPlan.training_days_per_week > 3) {
      newErrors.training_days_per_week = 'Training days must be between 1 and 3';
    }
    
    // Validate number of weeks
    if (numWeeks < 1 || numWeeks > 4) {
      newErrors.numWeeks = 'Number of weeks must be between 1 and 4';
    }
    
    // More permissive URL validation
    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/[^\s]*)*(\?[^\s]*)?$/i;
    
    if (!workoutPlan.image_url_1) {
      newErrors.image_url_1 = 'Image URL 1 is required';
    } else if (!urlRegex.test(workoutPlan.image_url_1)) {
      newErrors.image_url_1 = 'Image URL 1 must be a valid URL';
    }
    
    if (!workoutPlan.image_url_2) {
      newErrors.image_url_2 = 'Image URL 2 is required';
    } else if (!urlRegex.test(workoutPlan.image_url_2)) {
      newErrors.image_url_2 = 'Image URL 2 must be a valid URL';
    }
    
    // Validate plan details
    let emptyExerciseCount = 0;
    let insufficientExerciseCount = 0;
    
    for (let i = 1; i <= numWeeks; i++) {
      const weekIndex = `week${i}`;
      const days = ['Monday', 'Wednesday', 'Friday'].slice(0, workoutPlan.training_days_per_week);
      
      for (const day of days) {
        const exercises = workoutPlan.plan_details[weekIndex]?.[day];
        
        // Check for completely empty exercises
        if (!exercises || (Array.isArray(exercises) && exercises.length === 0) || 
            (typeof exercises === 'string' && !exercises.trim())) {
          emptyExerciseCount++;
          if (!newErrors.planDetails) {
            newErrors.planDetails = `Please fill in all workout days (Week ${i}, ${day} is empty)`;
          }
        } 
        // Check for insufficient content (less than 3 exercises or minimal content)
        else if (typeof exercises === 'string') {
          const exerciseList = exercises.split(',').map(ex => ex.trim()).filter(ex => ex);
          
          if (exerciseList.length < 2) {
            insufficientExerciseCount++;
            if (!newErrors.planDetailsContent && !newErrors.planDetails) {
              newErrors.planDetailsContent = `Add at least 2 exercises for Week ${i}, ${day} (separate with commas)`;
            }
          }
          
          // Check if any exercise names are too short
          const shortExercises = exerciseList.filter(ex => ex.length < 3);
          if (shortExercises.length > 0) {
            if (!newErrors.planDetailsContent && !newErrors.planDetails) {
              newErrors.planDetailsContent = `Exercise names should be at least 3 characters long (Week ${i}, ${day})`;
            }
          }
        }
      }
    }
    
    // Add summary errors if many days have issues
    if (emptyExerciseCount > 2) {
      newErrors.planDetailsSummary = `${emptyExerciseCount} workout days are empty. Please fill in all days.`;
    }
    
    if (insufficientExerciseCount > 2) {
      newErrors.planDetailsContentSummary = `${insufficientExerciseCount} workout days have insufficient exercises. Add at least 2 exercises per day.`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [workoutPlan, numWeeks]);

  // Debounced input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    const finalValue = name === 'training_days_per_week' ? 
      Math.min(Math.max(1, Number(value)), 3) : value;
    
    setWorkoutPlan(prev => ({ ...prev, [name]: finalValue }));
    
    // Mark form as touched when user makes changes
    if (!formTouched) {
      setFormTouched(true);
    }
    
    // Debounced error clearing
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      // Clear specific error if it exists
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }, 300);
  };

  const handleWeekChange = (e, weekIndex, day) => {
    const { value } = e.target;
    
    // Store as a string in the UI, will convert to array on submit
    setWorkoutPlan(prev => ({
      ...prev,
      plan_details: {
        ...prev.plan_details,
        [weekIndex]: {
          ...prev.plan_details[weekIndex],
          [day]: value,
        },
      },
    }));
    
    // Mark form as touched when user makes changes
    if (!formTouched) {
      setFormTouched(true);
    }
    
    // Debounced error clearing
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      // Clear specific error if it exists
      if (errors.planDetails || errors.planDetailsContent || errors.planDetailsSummary || errors.planDetailsContentSummary) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.planDetails;
          delete newErrors.planDetailsContent;
          delete newErrors.planDetailsSummary;
          delete newErrors.planDetailsContentSummary;
          return newErrors;
        });
      }
    }, 300);
  };

  const handleNumWeeksChange = (e) => {
    const newNumWeeks = Math.min(Math.max(1, Number(e.target.value)), 4);
    setNumWeeks(newNumWeeks);
    
    // Debounced error clearing
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      // Clear specific error if it exists
      if (errors.numWeeks) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.numWeeks;
          return newErrors;
        });
      }
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      window.scrollTo(0, 0); // Scroll to top to show errors
      return;
    }
    
    setIsSubmitting(true);
    
    // Process plan details to convert string inputs to arrays
    const processedWorkoutPlan = { ...workoutPlan };
    
    // Convert string values to arrays in plan_details
    for (const week in processedWorkoutPlan.plan_details) {
      for (const day in processedWorkoutPlan.plan_details[week]) {
        const exercises = processedWorkoutPlan.plan_details[week][day];
        
        // If exercises is a string (from textarea), convert to array
        if (typeof exercises === 'string') {
          processedWorkoutPlan.plan_details[week][day] = 
            exercises.split(',').map(exercise => exercise.trim()).filter(exercise => exercise);
        }
      }
    }

    try {
      const response = await csrfFetch(`/api/workoutPlans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(processedWorkoutPlan),
      });

      if (response.ok) {
        navigate(`/workout/${id}`); // Redirect to the workout plan page after editing
      } else {
        const errorData = await response.json();
        
        if (errorData.errors) {
          // Format server validation errors
          const serverErrors = {};
          errorData.errors.forEach(error => {
            // Map server error fields to client fields
            const fieldMap = {
              'title': 'title',
              'description': 'description',
              'goal': 'goal',
              'training_days_per_week': 'training_days_per_week',
              'plan_details': 'planDetails',
              'image_url_1': 'image_url_1',
              'image_url_2': 'image_url_2'
            };
            
            const field = error.toLowerCase().includes('image url 1') ? 'image_url_1' :
                         error.toLowerCase().includes('image url 2') ? 'image_url_2' :
                         Object.keys(fieldMap).find(key => error.toLowerCase().includes(key)) || 'general';
                         
            serverErrors[fieldMap[field] || field] = error;
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: errorData.message || 'Failed to update workout plan' });
        }
      }
    } catch (err) {
      console.error('Error updating workout plan', err);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoize the week rendering to reduce re-renders
  const renderWeeks = useMemo(() => {
    const weeks = [];
    for (let i = 1; i <= numWeeks; i++) {
      const weekIndex = `week${i}`;
      weeks.push(
        <div key={weekIndex} className="week-container">
          <h3>Week {i}</h3>
          {['Monday', 'Wednesday', 'Friday']
            .slice(0, workoutPlan.training_days_per_week)
            .map((day, dayIndex) => {
              // Get exercises - could be an array or a string depending on edit state
              let exerciseValue = workoutPlan.plan_details[weekIndex]?.[day] || '';
              
              // If exercises is an array, convert to comma-separated string for textarea
              if (Array.isArray(exerciseValue)) {
                exerciseValue = exerciseValue.join(', ');
              }
              
              // Determine if this specific day has an error
              const hasError = errors.planDetails && 
                errors.planDetails.includes(`Week ${i}, ${day}`) ||
                errors.planDetailsContent && 
                errors.planDetailsContent.includes(`Week ${i}, ${day}`);
              
              return (
                <div key={dayIndex} className="exercise-entry">
                  <label htmlFor={`week-${i}-day-${day}`}>{day}</label>
                  <textarea
                    id={`week-${i}-day-${day}`}
                    name={day}
                    value={exerciseValue}
                    onChange={(e) => handleWeekChange(e, weekIndex, day)}
                    placeholder="Enter exercises (comma separated, e.g.: Squats, Bench Press, Deadlifts)"
                    className={hasError ? 'error-input' : ''}
                    disabled={isSubmitting}
                  />
                  {hasError && (
                    <p className="exercise-hint">
                      Add at least 2 exercises, each with a descriptive name (3+ characters)
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      );
    }
    return weeks;
  }, [numWeeks, workoutPlan.training_days_per_week, workoutPlan.plan_details, errors, isSubmitting, handleWeekChange]);

  if (loading) return <p className="loading-message">Loading workout plan...</p>;
  if (fetchError) return (
    <div className="error-container">
      <h2>Error Loading Workout Plan</h2>
      <p className="error-text">{fetchError}</p>
      <button onClick={() => navigate('/workouts')}>Back to Workouts</button>
    </div>
  );

  return (
    <div className="edit-workout-plan-container">
      <h1>Edit Workout Plan</h1>
      
      {errors.general && (
        <div className="error-banner">{errors.general}</div>
      )}
      
      {(errors.planDetailsSummary || errors.planDetailsContentSummary) && (
        <div className="warning-banner">
          {errors.planDetailsSummary && <p>{errors.planDetailsSummary}</p>}
          {errors.planDetailsContentSummary && <p>{errors.planDetailsContentSummary}</p>}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={workoutPlan.title}
            onChange={handleChange}
            placeholder="Descriptive title (min. 3 characters)"
            className={errors.title ? 'error-input' : ''}
            maxLength={100}
            disabled={isSubmitting}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={workoutPlan.description}
            onChange={handleChange}
            placeholder="Detailed description of the workout plan (min. 10 characters)"
            className={errors.description ? 'error-input' : ''}
            disabled={isSubmitting}
          />
          {errors.description && <p className="error-message">{errors.description}</p>}
        </div>

        <div className="form-group">
          <label>Goal:</label>
          <input
            type="text"
            name="goal"
            value={workoutPlan.goal}
            onChange={handleChange}
            placeholder="What this workout helps achieve (min. 5 characters)"
            className={errors.goal ? 'error-input' : ''}
            disabled={isSubmitting}
          />
          {errors.goal && <p className="error-message">{errors.goal}</p>}
        </div>

        <div className="flex-inputs">
          <div className="form-group">
            <label>Training Days Per Week:</label>
            <input
              type="number"
              name="training_days_per_week"
              value={workoutPlan.training_days_per_week}
              onChange={handleChange}
              min="1"
              max="3"
              className={errors.training_days_per_week ? 'error-input' : ''}
              disabled={isSubmitting}
            />
            {errors.training_days_per_week && 
              <p className="error-message">{errors.training_days_per_week}</p>}
          </div>

          <div className="form-group">
            <label>How many weeks for the plan?</label>
            <input
              type="number"
              value={numWeeks}
              onChange={handleNumWeeksChange}
              min="1"
              max="4"
              className={errors.numWeeks ? 'error-input' : ''}
              disabled={isSubmitting}
            />
            {errors.numWeeks && <p className="error-message">{errors.numWeeks}</p>}
          </div>
        </div>

        {errors.planDetails && <p className="error-message plan-error">{errors.planDetails}</p>}
        {errors.planDetailsContent && <p className="error-message plan-error">{errors.planDetailsContent}</p>}
        
        <div className="workout-instructions">
          <h3>Workout Plan Details</h3>
          <p>For each day, enter at least 2 exercises separated by commas.</p>
          <p>Example: &ldquo;Squats, Bench Press, Deadlifts, Bicep Curls&rdquo;</p>
        </div>
        
        {renderWeeks}

        <div className="form-group">
          <label>Image URL 1:</label>
          <input
            type="url"
            name="image_url_1"
            value={workoutPlan.image_url_1}
            onChange={handleChange}
            placeholder="https://example.com/image1.jpg"
            className={errors.image_url_1 ? 'error-input' : ''}
            disabled={isSubmitting}
          />
          {errors.image_url_1 && <p className="error-message">{errors.image_url_1}</p>}
        </div>

        <div className="form-group">
          <label>Image URL 2:</label>
          <input
            type="url"
            name="image_url_2"
            value={workoutPlan.image_url_2}
            onChange={handleChange}
            placeholder="https://example.com/image2.jpg"
            className={errors.image_url_2 ? 'error-input' : ''}
            disabled={isSubmitting}
          />
          {errors.image_url_2 && <p className="error-message">{errors.image_url_2}</p>}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditWorkoutPlan;