const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Backend validation for signup
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
    const { email, password, username } = req.body;

    try {
        // Check if email already exists
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            const err = new Error('Email already exists');
            err.status = 400;
            err.title = 'Signup failed';
            err.errors = { email: 'This email is already in use.' };
            return next(err);
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            const err = new Error('Username already exists');
            err.status = 400;
            err.title = 'Signup failed';
            err.errors = { username: 'This username is already taken.' };
            return next(err);
        }

        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({ email, username, hashedPassword });

        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    } catch (error) {
        // Handle Sequelize unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            const err = new Error('User already exists');
            err.status = 400;
            err.title = 'Signup failed';
            
            // Identify which field caused the constraint error
            const errors = {};
            error.errors.forEach(e => {
                if (e.path === 'email') {
                    errors.email = 'This email is already in use.';
                } else if (e.path === 'username') {
                    errors.username = 'This username is already taken.';
                }
            });
            
            err.errors = errors;
            return next(err);
        }
        
        // Handle other errors
        const err = new Error('Signup failed');
        err.status = 500;
        err.title = 'Server Error';
        err.errors = { server: 'An unexpected error occurred. Please try again.' };
        return next(err);
    }
});

// Restore session user
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        return res.json({
            user: safeUser
        });
    } else return res.json({ user: null });
});

// Get all users (Admin or logged-in user)
router.get('/all', async (req, res) => {
    try {
        const users = await User.findAll();
        const usersList = users.map(user => ({
            id: user.id,
            email: user.email,
            username: user.username,
        }));
        return res.json({ users: usersList });
    } catch (error) {
        const err = new Error('Failed to fetch users');
        err.status = 500;
        err.title = 'Failed to fetch users';
        return res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (user) {
            const safeUser = {
                id: user.id,
                email: user.email,
                username: user.username,
            };
            return res.json({ user: safeUser });
        } else {
            const err = new Error('User not found');
            err.status = 404;
            err.title = 'User not found';
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        const err = new Error('Failed to fetch user');
        err.status = 500;
        err.title = 'Failed to fetch user';
        return res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
});

module.exports = router;