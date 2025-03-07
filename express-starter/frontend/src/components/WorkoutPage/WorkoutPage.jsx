import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { csrfFetch } from '../../redux/csrf'; 
import styles from './WorkoutPage.module.css'; 
import Modal from './Modal'; 

const WorkoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = useSelector(state => state.session.user);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  
  // Error handling states for reviews
  const [reviewErrors, setReviewErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const fetchWorkoutPlan = async () => {
      try {
        const response = await csrfFetch(`/api/workoutPlans/${id}`);
        if (response.ok) {
          const data = await response.json();
          setWorkoutPlan(data);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch the workout plan');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlan();
  }, [id]);

  // Fetch reviews for this workout plan
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await csrfFetch(`/api/reviews/workout-plan/${id}`);
        if (response.ok) {
          const data = await response.json();
          
          // Process the review data to ensure correct structure
          const processedReviews = data.map(review => ({
            ...review,
            // Ensure user_id is present and properly formatted
            user_id: review.user_id !== undefined ? Number(review.user_id) : 
                     review.User?.id !== undefined ? Number(review.User.id) : null
          }));
          
          setReviews(processedReviews);
        } else {
          const errorData = await response.json();
          console.error('Error fetching reviews:', errorData.message || 'Failed to fetch reviews');
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this workout plan?')) return;
  
    try {
      const response = await csrfFetch(`/api/workoutPlans/${id}`, { method: 'DELETE' });
  
      if (response.ok) {
        navigate('/');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the workout plan.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Validate review input
  const validateReview = (review) => {
    const errors = {};
    
    if (!review.rating || review.rating < 1 || review.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }
    
    if (!review.comment) {
      errors.comment = 'Comment is required';
    } else if (review.comment.trim().length < 5) {
      errors.comment = 'Comment must be at least 5 characters long';
    } else if (review.comment.trim().length > 500) {
      errors.comment = 'Comment must be less than 500 characters';
    }
    
    return errors;
  };

  // Handle review form input changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    
    // Clear errors when user types
    if (reviewErrors[name]) {
      setReviewErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
    
    if (editingReview) {
      setEditingReview({
        ...editingReview,
        [name]: name === 'rating' ? parseInt(value, 10) : value
      });
    } else {
      setNewReview({
        ...newReview,
        [name]: name === 'rating' ? parseInt(value, 10) : value
      });
    }
  };

  // Submit a new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setReviewErrors({ auth: 'You must be logged in to leave a review' });
      return;
    }
    
    // Validate review before submitting
    const validationErrors = validateReview(newReview);
    if (Object.keys(validationErrors).length > 0) {
      setReviewErrors(validationErrors);
      return;
    }
    
    setSubmitLoading(true);
    setReviewErrors({});

    try {
      const response = await csrfFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          workout_id: id,
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      if (response.ok) {
        const data = await response.json();
       
        const reviewWithUser = {
          ...data.review,
          user_id: Number(currentUser.id), 
          User: { 
            username: currentUser.username, 
            id: Number(currentUser.id) 
          }
        };
        setReviews([...reviews, reviewWithUser]);
        setNewReview({ rating: 5, comment: '' });
        setIsCreateModalOpen(false); 
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          // Handle validation errors from server
          const formattedErrors = {};
          errorData.errors.forEach(err => {
            if (err.toLowerCase().includes('rating')) {
              formattedErrors.rating = err;
            } else if (err.toLowerCase().includes('comment')) {
              formattedErrors.comment = err;
            } else {
              formattedErrors.general = err;
            }
          });
          setReviewErrors(formattedErrors);
        } else {
          throw new Error(errorData.message || 'Failed to submit review');
        }
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewErrors({ general: err.message || 'Network error. Please try again.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Start editing a review
  const handleEditReview = (review) => {
    setEditingReview({
      id: review.id,
      rating: review.rating,
      comment: review.comment
    });
    setReviewErrors({});
    setIsEditModalOpen(true);
  };

  // Update an existing review
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    
    // Validate review before updating
    const validationErrors = validateReview(editingReview);
    if (Object.keys(validationErrors).length > 0) {
      setReviewErrors(validationErrors);
      return;
    }
    
    setUpdateLoading(true);
    setReviewErrors({});
    
    try {
      const response = await csrfFetch(`/api/reviews/${editingReview.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          rating: editingReview.rating,
          comment: editingReview.comment
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update the reviews state with the updated review
        const updatedReviews = reviews.map(rev => 
          rev.id === editingReview.id 
            ? { 
                ...rev, 
                rating: data.review.rating, 
                comment: data.review.comment 
              } 
            : rev
        );
        setReviews(updatedReviews);
        setEditingReview(null);
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        if (errorData.errors) {
          // Handle validation errors from server
          const formattedErrors = {};
          errorData.errors.forEach(err => {
            if (err.toLowerCase().includes('rating')) {
              formattedErrors.rating = err;
            } else if (err.toLowerCase().includes('comment')) {
              formattedErrors.comment = err;
            } else {
              formattedErrors.general = err;
            }
          });
          setReviewErrors(formattedErrors);
        } else {
          throw new Error(errorData.message || 'Failed to update review');
        }
      }
    } catch (err) {
      console.error('Error updating review:', err);
      setReviewErrors({ general: err.message || 'Network error. Please try again.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (reviewId) => {
    setReviewToDelete(reviewId);
    setReviewErrors({});
    setIsDeleteModalOpen(true);
  };

  // Delete a review
  const handleDeleteReview = async () => {
    setDeleteLoading(true);
    setReviewErrors({});
    
    try {
      const response = await csrfFetch(`/api/reviews/${reviewToDelete}`, { 
        method: 'DELETE' 
      });

      if (response.ok) {
        setReviews(reviews.filter(rev => rev.id !== reviewToDelete));
        setIsDeleteModalOpen(false);
        setReviewToDelete(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      setReviewErrors({ general: err.message || 'Failed to delete review. Please try again.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`${styles.star} ${i <= rating ? styles.filledStar : ''}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Check if the current user is the owner of the workout plan
  const isWorkoutOwner = () => {
    if (!currentUser || !workoutPlan) return false;
    return Number(currentUser.id) === Number(workoutPlan.user_id);
  };

  // Check if the current user has already left a review
  const hasUserReviewed = () => {
    if (!currentUser) return false;
    
    const currentUserId = Number(currentUser.id);
    
    return reviews.some(review => {
  
      const reviewUserId = review.user_id !== undefined ? Number(review.user_id) : 
                           review.User?.id !== undefined ? Number(review.User.id) : null;
      
      return reviewUserId === currentUserId;
    });
  };
  
  // Check if a specific review belongs to the current user
  const isUserReviewOwner = (review) => {
    if (!currentUser) return false;
    
    const currentUserId = Number(currentUser.id);
    const reviewUserId = review.user_id !== undefined ? Number(review.user_id) : 
                         review.User?.id !== undefined ? Number(review.User.id) : null;
    
    return reviewUserId === currentUserId;
  };

  // Check if the user should be able to add a review
  const canAddReview = () => {
    // User must be logged in, must not have already reviewed, and must not be the workout plan owner
    return currentUser && !hasUserReviewed() && !isWorkoutOwner();
  };

  if (loading) return <p>Loading workout plan...</p>;
  if (error) return <p className={styles.errorText}>{error}</p>;
  if (!workoutPlan) return <p>No workout plan found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{workoutPlan.title}</h1>
      
      <div className={styles.imagesContainer}>
        {workoutPlan.image_url_1 && <img src={workoutPlan.image_url_1} alt="Workout" className={styles.image} />}
        {workoutPlan.image_url_2 && <img src={workoutPlan.image_url_2} alt="Workout" className={styles.image} />}
      </div>
  
      <div className={styles.infoSection}>
        <p className={styles.description}>{workoutPlan.description}</p>
        <p><span className={styles.boldText}>Goal:</span> {workoutPlan.goal}</p>
        <p><span className={styles.boldText}>Training Days Per Week:</span> {workoutPlan.training_days_per_week}</p>
  
        <h3>Workout Plan Details:</h3>
        <div className={styles.planDetails}>
          {workoutPlan.plan_details && Object.keys(workoutPlan.plan_details).map((week) => (
            <div key={week} className={styles.weekDetails}>
              <h4 className={styles.weekTitle}>{week.charAt(0).toUpperCase() + week.slice(1)}</h4>
              <div className={styles.dayContainer}>
                {Object.keys(workoutPlan.plan_details[week]).map((day) => (
                  <div key={day} className={styles.day}>
                    <h5 className={styles.dayTitle}>{day}</h5>
                    <ul className={styles.exerciseList}>
                      {workoutPlan.plan_details[week][day].map((exercise, index) => (
                        <li key={index} className={styles.exercise}>{exercise}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.reviewsTitle}>Reviews</h2>
          {/* Only show Add Review button if user is logged in, hasn't already reviewed, and is not the workout owner */}
          {canAddReview() && (
            <button 
              className={styles.addReviewButton}
              onClick={() => {
                setReviewErrors({});
                setNewReview({ rating: 5, comment: '' });
                setIsCreateModalOpen(true);
              }}
            >
              Add Review
            </button>
          )}
        </div>
        
        {reviews.length > 0 && (
          <div className={styles.averageRating}>
            <p>Average Rating: {calculateAverageRating()} / 5</p>
            <div className={styles.stars}>{renderStars(Math.round(calculateAverageRating()))}</div>
          </div>
        )}

        {/* Reviews List */}
        <div className={styles.reviewsList}>
          {reviewsLoading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review this workout plan!</p>
          ) : (
            reviews.map(review => {
              // Flag to highlight the current user's review
              const isUserReview = isUserReviewOwner(review);
              
              return (
                <div key={review.id} className={`${styles.reviewCard} ${isUserReview ? styles.userReview : ''}`}>
                  <div className={styles.reviewHeader}>
                    <h4 className={styles.reviewUsername}>{review.User?.username || 'Anonymous'}</h4>
                    <div className={styles.stars}>{renderStars(review.rating)}</div>
                  </div>
                  <p className={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</p>
                  <p className={styles.reviewComment}>{review.comment}</p>
                  
                  {/* Only show edit/delete buttons for the review owner */}
                  {isUserReview && (
                    <div className={styles.reviewActions}>
                      <button 
                        className={styles.editReviewButton} 
                        onClick={() => handleEditReview(review)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteReviewButton} 
                        onClick={() => openDeleteModal(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {isWorkoutOwner() && (
        <div className={styles.buttonsContainer}>
          <button className={styles.editButton} onClick={() => navigate(`/edit-workout/${id}`)}>
            Edit Workout Plan
          </button>
          <button className={styles.deleteButton} onClick={handleDelete}>
            Delete Workout Plan
          </button>
        </div>
      )}

      {/* Only show Create Your Own Workout Plan button when user is logged in, without container div */}
      {currentUser && (
        <button className={styles.createButton} onClick={() => navigate('/create-workout')}>
          Create Your Own Workout Plan
        </button>
      )}

      {/* Create Review Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          if (!submitLoading) {
            setIsCreateModalOpen(false);
            setReviewErrors({});
          }
        }}
        title="Add Review"
      >
        <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
          {reviewErrors.general && (
            <div className={styles.errorMessage}>{reviewErrors.general}</div>
          )}
          {reviewErrors.auth && (
            <div className={styles.errorMessage}>{reviewErrors.auth}</div>
          )}
          
          <div className={styles.formGroup}>
            <label htmlFor="rating">Rating:</label>
            <select 
              id="rating" 
              name="rating" 
              value={newReview.rating} 
              onChange={handleReviewChange}
              className={reviewErrors.rating ? styles.inputError : ''}
              disabled={submitLoading}
              required
            >
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            {reviewErrors.rating && (
              <p className={styles.fieldError}>{reviewErrors.rating}</p>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="comment">Comment:</label>
            <textarea 
              id="comment" 
              name="comment" 
              value={newReview.comment} 
              onChange={handleReviewChange}
              rows="4"
              placeholder="Share your thoughts on this workout plan (min. 5 characters)"
              className={reviewErrors.comment ? styles.inputError : ''}
              disabled={submitLoading}
              required
            ></textarea>
            {reviewErrors.comment && (
              <p className={styles.fieldError}>{reviewErrors.comment}</p>
            )}
            <div className={styles.charCount}>
              {newReview.comment.length}/500 characters
            </div>
          </div>
          
          <button 
            type="submit" 
            className={styles.submitReviewButton}
            disabled={submitLoading}
          >
            {submitLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </Modal>

      {/* Edit Review Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          if (!updateLoading) {
            setIsEditModalOpen(false);
            setEditingReview(null);
            setReviewErrors({});
          }
        }}
        title="Edit Review"
      >
        {editingReview && (
          <form onSubmit={handleUpdateReview} className={styles.reviewForm}>
            {reviewErrors.general && (
              <div className={styles.errorMessage}>{reviewErrors.general}</div>
            )}
            
            <div className={styles.formGroup}>
              <label htmlFor="edit-rating">Rating:</label>
              <select 
                id="edit-rating" 
                name="rating" 
                value={editingReview.rating} 
                onChange={handleReviewChange}
                className={reviewErrors.rating ? styles.inputError : ''}
                disabled={updateLoading}
                required
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              {reviewErrors.rating && (
                <p className={styles.fieldError}>{reviewErrors.rating}</p>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="edit-comment">Comment:</label>
              <textarea 
                id="edit-comment" 
                name="comment" 
                value={editingReview.comment} 
                onChange={handleReviewChange}
                rows="4"
                placeholder="Share your thoughts on this workout plan (min. 5 characters)"
                className={reviewErrors.comment ? styles.inputError : ''}
                disabled={updateLoading}
                required
              ></textarea>
              {reviewErrors.comment && (
                <p className={styles.fieldError}>{reviewErrors.comment}</p>
              )}
              <div className={styles.charCount}>
                {editingReview.comment.length}/500 characters
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.updateReviewButton}
              disabled={updateLoading}
            >
              {updateLoading ? 'Updating...' : 'Update Review'}
            </button>
          </form>
        )}
      </Modal>

      {/* Delete Review Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!deleteLoading) {
            setIsDeleteModalOpen(false);
            setReviewToDelete(null);
            setReviewErrors({});
          }
        }}
        title="Delete Review"
      >
        {reviewErrors.general && (
          <div className={styles.errorMessage}>{reviewErrors.general}</div>
        )}
        
        <p>Are you sure you want to delete this review?</p>
        <div className={styles.modalActions}>
          <button 
            onClick={handleDeleteReview} 
            className={styles.confirmDeleteButton}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button 
            onClick={() => {
              if (!deleteLoading) {
                setIsDeleteModalOpen(false);
                setReviewToDelete(null);
                setReviewErrors({});
              }
            }} 
            className={styles.cancelButton}
            disabled={deleteLoading}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );  
};

export default WorkoutPage;