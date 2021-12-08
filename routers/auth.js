const express = require('express');
const { body } = require('express-validator');

const People = require('../models/People');

const authController = require('../controllers/auth');
const isAuth = require('../middlewares/auth/isAuth');

const router = express.Router();

// PUT -> /auth/signup
router.put(
	'/signup',
	[
		body('username')
			.not()
			.isEmpty()
			.withMessage('Username cannot be empty.')
			.custom((value, { req }) => {
				return People.findOne({ username: value }).then((user) => {
					if (user) {
						return Promise.reject('Username already in use.');
					}
				});
			})
			.trim(),
		body('email')
			.isEmail()
			.withMessage('Please enter a valid E-Mail.')
			.custom((value, { req }) => {
				return People.findOne({ email: value }).then((user) => {
					if (user) {
						return Promise.reject(
							'Account already exist with the E-Mail.'
						);
					}
				});
			})
			.normalizeEmail({ gmail_remove_dots: false }),
		body('password')
			.isLength({ min: 8 })
			.withMessage('Password must be atleast 8 characters long.')
			.trim(),
		body('confirmPassword')
			.custom((value, { req }) => {
				if (value != req.body.password) {
					throw new Error('Passwords do not match!');
				}
				return true;
			})
			.trim(),
	],
	authController.signup
);

// GET -> /auth/verfication/:token
router.get('/verification/:token', authController.getVerfication);

// POST -> /auth/login
router.post(
	'/login',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid E-Mail.')
			.custom((value, { req }) => {
				return People.findOne({ email: value }).then((user) => {
					if (!user) {
						return Promise.reject(
							'Account not found with the email'
						);
					}
				});
			})
			.normalizeEmail(),
		body('password').trim(),
	],
	authController.postlogin
);

// PUT -> /auth/reset-password
router.put(
	'/reset-password',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid E-Mail.')
			.custom((value, { req }) => {
				return People.findOne({ email: value }).then((user) => {
					if (!user) {
						return Promise.reject(
							'Account not found with the email'
						);
					}
				});
			})
			.normalizeEmail(),
	],
	authController.putResetPassword
);

// GET -> /auth/reset-now/:token
router.get('/reset-now/:token', authController.getResetNow);

// PUT -> /auth/reset-now
router.put(
	'/reset-now',
	[
		body('password')
			.isLength({ min: 8 })
			.withMessage('Password must be atleast 8 characters long.')
			.trim(),
		body('confirmNewPassword')
			.custom((value, { req }) => {
				if (value != req.body.newPassword) {
					throw new Error('Passwords do not match!');
				}
				return true;
			})
			.trim(),
	],
	authController.putResetNow
);

router.get('/refresh-token', authController.refreshToken);

module.exports = router;
