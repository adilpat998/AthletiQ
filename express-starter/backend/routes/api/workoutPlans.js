const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { WorkoutPlan } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Validation for creating a workout plan
const validateWorkoutPlan = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a title for the workout plan.'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a description for the workout plan.'),
    check('goal')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a goal for the workout plan.'),
    check('training_days_per_week')
        .isInt({ min: 1 })
        .withMessage('Training days per week must be an integer greater than 0.'),
    check('plan_details')
        .exists({ checkFalsy: true })
        .withMessage('Please provide the details of the workout plan in JSON format.'),
    handleValidationErrors
];

// Create a new workout plan
router.post('/', requireAuth, validateWorkoutPlan, async (req, res, next) => {
    const { title, description, goal, training_days_per_week, plan_details } = req.body;

    try {
        const workoutPlan = await WorkoutPlan.create({
            title,
            description,
            goal,
            training_days_per_week,
            plan_details,
            user_id: req.user.id
        });
        return res.status(201).json(workoutPlan);
    } catch (error) {
        next(error);
    }
});

// Get all workout plans
router.get('/', async (_req, res, next) => {
    try {
        const workoutPlans = await WorkoutPlan.findAll();
        return res.json(workoutPlans);
    } catch (error) {
        next(error);
    }
});

// Get a workout plan by ID
router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    
    try {
        const workoutPlan = await WorkoutPlan.findByPk(id);
        
        if (!workoutPlan) {
            const err = new Error('Workout plan not found');
            err.status = 404;
            return next(err);
        }
        
        return res.json(workoutPlan);
    } catch (error) {
        next(error);
    }
});

// Update a workout plan by ID
router.patch('/:id', requireAuth, validateWorkoutPlan, async (req, res, next) => {
    const { id } = req.params;
    const { title, description, goal, training_days_per_week, plan_details } = req.body;

    try {
        const workoutPlan = await WorkoutPlan.findByPk(id);

        if (!workoutPlan) {
            const err = new Error('Workout plan not found');
            err.status = 404;
            return next(err);
        }

        if (workoutPlan.user_id !== req.user.id) {
            const err = new Error('You are not authorized to edit this workout plan');
            err.status = 403;
            return next(err);
        }

        workoutPlan.title = title;
        workoutPlan.description = description;
        workoutPlan.goal = goal;
        workoutPlan.training_days_per_week = training_days_per_week;
        workoutPlan.plan_details = plan_details;

        await workoutPlan.save();

        return res.json(workoutPlan);
    } catch (error) {
        next(error);
    }
});

// Delete a workout plan by ID
router.delete('/:id', requireAuth, async (req, res, next) => {
    const { id } = req.params;

    try {
        const workoutPlan = await WorkoutPlan.findByPk(id);

        if (!workoutPlan) {
            const err = new Error('Workout plan not found');
            err.status = 404;
            return next(err);
        }

        if (workoutPlan.user_id !== req.user.id) {
            const err = new Error('You are not authorized to delete this workout plan');
            err.status = 403;
            return next(err);
        }

        await workoutPlan.destroy();
        return res.json({ message: 'Workout plan deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
