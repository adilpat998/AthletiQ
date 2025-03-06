const express = require('express');
const { Review, User, WorkoutPlan } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Create a new review
router.post('/', requireAuth, async (req, res) => {
    const { workout_id, rating, comment } = req.body;
    const { user } = req;

    // Check if the workout exists
    const workout = await WorkoutPlan.findByPk(workout_id);
    if (!workout) {
        return res.status(404).json({ message: 'Workout Plan not found' });
    }

    try {
        const review = await Review.create({
            workout_id,
            user_id: user.id,  // Using the logged-in user's ID
            rating,
            comment,
        });

        return res.status(201).json({
            review: {
                id: review.id,
                workout_id: review.workout_id,
                user_id: review.user_id,
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating review' });
    }
});

// Get all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: User, attributes: ['username'] },
                { model: WorkoutPlan, attributes: ['title'] },
            ],
        });

        return res.json({
            reviews: reviews.map(review => ({
                id: review.id,
                workout_id: review.workout_id,
                user_id: review.user_id,
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at,
                user: review.User.username,  // Adding username for the user who left the review
                workout: review.WorkoutPlan.title,  
            })),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching reviews' });
    }
});

// Get a review by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const review = await Review.findByPk(id, {
            include: [
                { model: User, attributes: ['username'] },
                { model: WorkoutPlan, attributes: ['title'] },
            ],
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.json({
            review: {
                id: review.id,
                workout_id: review.workout_id,
                user_id: review.user_id,
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at,
                user: review.User.username,  
                workout: review.WorkoutPlan.title,  
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching review' });
    }
});

// Update a review by ID
router.patch('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const { user } = req;

    try {
        const review = await Review.unscoped().findByPk(id); 

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user_id !== user.id) {
            return res.status(403).json({ message: 'Forbidden: You can only edit your own reviews' });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        return res.json({
            review: {
                id: review.id,
                workout_id: review.workout_id,
                user_id: review.user_id,
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating review' });
    }
});

// Delete a review by ID
router.delete('/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    try {
        const review = await Review.unscoped().findByPk(id); 

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the logged-in user is the one who created the review
        if (review.user_id !== user.id) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own reviews' });
        }

        // Delete the review
        await review.destroy();

        return res.status(204).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting review' });
    }
});

// Get all reviews for a specific workout plan by ID
router.get('/workout-plan/:workoutId', async (req, res) => {
    const { workoutId } = req.params;

    try {
        // Find all reviews for the workout plan by workout_id
        const reviews = await Review.findAll({
            where: {
                workout_id: workoutId,
            },
            include: [
                {
                    model: User, 
                    attributes: ['id', 'username'],
                },
            ],
        });

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this workout plan' });
        }

        // Return the reviews
        return res.json(reviews);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching reviews' });
    }
});


module.exports = router;

