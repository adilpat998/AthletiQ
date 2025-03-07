import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { csrfFetch } from '../../redux/csrf';
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
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);
  
  // For debouncing
  const updateTimeoutRef = useRef(null);
  const prevTrainingDaysRef = useRef(1);
  const prevNumWeeksRef = useRef(1);

  const navigate = useNavigate();

  // Initialize plan details when numWeeks or trainingDaysPerWeek changes with debouncing
  useEffect(() => {
    // Check if values actually changed to avoid unnecessary updates
    if (prevTrainingDaysRef.current === trainingDaysPerWeek && 
        prevNumWeeksRef.current === numWeeks) {
      return;
    }
    
    // Update refs with current values
    prevTrainingDaysRef.current = trainingDaysPerWeek;
    prevNumWeeksRef.current = numWeeks;
    
    // Clear any pending updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Debounce the update to prevent excessive re-renders
    updateTimeoutRef.current = setTimeout(() => {
      setPlanDetails(prev => {
        const newPlanDetails = { ...prev };
        
        for (let i = 1; i <= numWeeks; i++) {
          const weekIndex = `week${i}`;
          
          if (!newPlanDetails[weekIndex]) {
            newPlanDetails[weekIndex] = {};
          }
          
          // Make sure each week has the correct days based on trainingDaysPerWeek
          const days = ['Monday', 'Wednesday', 'Friday'].slice(0, trainingDaysPerWeek);
          
          days.forEach(day => {
            if (!newPlanDetails[weekIndex][day]) {
              newPlanDetails[weekIndex][day] = '';
            }
          });
        }
        
        // Remove extra weeks if numWeeks was reduced
        Object.keys(newPlanDetails)
          .filter(key => key.startsWith('week'))
          .forEach(weekKey => {
            const weekNum = parseInt(weekKey.replace('week', ''));
            if (weekNum > numWeeks) {
              delete newPlanDetails[weekKey];
            }
          });
        
        return newPlanDetails;
      });
    }, 300); // 300ms debounce
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [numWeeks, trainingDaysPerWeek]);

  // Enhanced validation function
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Enhanced Title validation - minimum 3 characters
    if (!title) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Enhanced Description validation - minimum 10 characters
    if (!description) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long - provide details about this workout';
    }
    
    // Enhanced Goal validation - minimum 5 characters
    if (!goal) {
      newErrors.goal = 'Goal is required';
    } else if (goal.trim().length < 5) {
      newErrors.goal = 'Goal must be at least 5 characters long - be specific about what this workout helps achieve';
    }
    
    // Validate training days
    if (trainingDaysPerWeek < 1 || trainingDaysPerWeek > 3) {
      newErrors.trainingDaysPerWeek = 'Training days must be between 1 and 3';
    }
    
    // Validate number of weeks
    if (numWeeks < 1 || numWeeks > 4) {
      newErrors.numWeeks = 'Number of weeks must be between 1 and 4';
    }
    
    // More permissive URL validation
    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/[^\s]*)*(\?[^\s]*)?$/i;
    
    if (!imageUrl1) {
      newErrors.imageUrl1 = 'Image URL 1 is required';
    } else if (!urlRegex.test(imageUrl1)) {
      newErrors.imageUrl1 = 'Image URL 1 must be a valid URL';
    }
    
    if (!imageUrl2) {
      newErrors.imageUrl2 = 'Image URL 2 is required';
    } else if (!urlRegex.test(imageUrl2)) {
      newErrors.imageUrl2 = 'Image URL 2 must be a valid URL';
    }
    
    // Validate plan details
    let emptyExerciseCount = 0;
    let insufficientExerciseCount = 0;
    
    for (let i = 1; i <= numWeeks; i++) {
      const weekIndex = `week${i}`;
      const days = ['Monday', 'Wednesday', 'Friday'].slice(0, trainingDaysPerWeek);
      
      for (const day of days) {
        const exercises = planDetails[weekIndex]?.[day];
        
        // Check for completely empty exercises
        if (!exercises || !exercises.trim()) {
          emptyExerciseCount++;
          if (!newErrors.planDetails) {
            newErrors.planDetails = `Please fill in all workout days (Week ${i}, ${day} is empty)`;
          }
        } 
        // Check for insufficient content (less than 2 exercises or minimal content)
        else {
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
  }, [title, description, goal, trainingDaysPerWeek, numWeeks, imageUrl1, imageUrl2, planDetails]);

  const handleWeekChange = (e, weekIndex, day) => {
    const { value } = e.target;
    setPlanDetails(prev => ({
      ...prev,
      [weekIndex]: {
        ...prev[weekIndex],
        [day]: value
      }
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

  // Handle input changes and clear related errors with debouncing
  const handleInputChange = (setter, field, value) => {
    setter(value);
    
    // Mark form as touched
    if (!formTouched) {
      setFormTouched(true);
    }
    
    // Debounced error clearing
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      // Clear error for this field if it exists
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
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

    // Process plan details to convert to array format
    const processedPlanDetails = {};
    for (const week in planDetails) {
      processedPlanDetails[week] = {};
      for (const day in planDetails[week]) {
        processedPlanDetails[week][day] = planDetails[week][day].split(',').map(exercise => exercise.trim()).filter(exercise => exercise);
      }
    }

    const workoutPlan = {
      title,
      description,
      goal,
      training_days_per_week: trainingDaysPerWeek,
      plan_details: processedPlanDetails,
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

        // Redirect after successful creation
        navigate(`/workout/${newPlanId}`);
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
              'training_days_per_week': 'trainingDaysPerWeek',
              'plan_details': 'planDetails',
              'image_url_1': 'imageUrl1',
              'image_url_2': 'imageUrl2'
            };
            
            const field = error.toLowerCase().includes('image url 1') ? 'imageUrl1' :
                         error.toLowerCase().includes('image url 2') ? 'imageUrl2' :
                         Object.keys(fieldMap).find(key => error.toLowerCase().includes(key)) || 'general';
                         
            serverErrors[fieldMap[field] || field] = error;
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: errorData.message || 'Error creating workout plan' });
        }
      }
    } catch (err) {
      console.error('Error creating workout plan', err);
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
          {['Monday', 'Wednesday', 'Friday'].slice(0, trainingDaysPerWeek).map((day, dayIndex) => {
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
                  value={(planDetails[weekIndex] && planDetails[weekIndex][day]) || ''}
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
  }, [numWeeks, trainingDaysPerWeek, planDetails, errors, isSubmitting, handleWeekChange]);

  return (
    <div className="create-workout-container">
      <h1>Create a New Workout Plan</h1>
      
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
            value={title} 
            onChange={(e) => handleInputChange(setTitle, 'title', e.target.value)} 
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
            value={description} 
            onChange={(e) => handleInputChange(setDescription, 'description', e.target.value)} 
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
            value={goal} 
            onChange={(e) => handleInputChange(setGoal, 'goal', e.target.value)} 
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
              value={trainingDaysPerWeek} 
              onChange={(e) => handleInputChange(setTrainingDaysPerWeek, 'trainingDaysPerWeek', Number(e.target.value))} 
              min="1" 
              max="3" 
              className={errors.trainingDaysPerWeek ? 'error-input' : ''}
              disabled={isSubmitting}
            />
            {errors.trainingDaysPerWeek && <p className="error-message">{errors.trainingDaysPerWeek}</p>}
          </div>

          <div className="form-group">
            <label>How many weeks for the plan?</label>
            <input 
              type="number" 
              value={numWeeks} 
              onChange={(e) => handleInputChange(setNumWeeks, 'numWeeks', Number(e.target.value))} 
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
            value={imageUrl1} 
            onChange={(e) => handleInputChange(setImageUrl1, 'imageUrl1', e.target.value)} 
            placeholder="https://example.com/image1.jpg"
            className={errors.imageUrl1 ? 'error-input' : ''}
            disabled={isSubmitting}
          />
          {errors.imageUrl1 && <p className="error-message">{errors.imageUrl1}</p>}
        </div>

        <div className="form-group">
          <label>Image URL 2:</label>
          <input 
            type="url" 
            value={imageUrl2} 
            onChange={(e) => handleInputChange(setImageUrl2, 'imageUrl2', e.target.value)} 
            placeholder="https://example.com/image2.jpg"
            className={errors.imageUrl2 ? 'error-input' : ''}
            disabled={isSubmitting}
          />
          {errors.imageUrl2 && <p className="error-message">{errors.imageUrl2}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Creating Workout Plan...' : 'Create Workout Plan'}
        </button>
      </form>
    </div>
  );
};

export default CreateWorkoutPage;