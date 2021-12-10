const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const jwt = require('jsonwebtoken');

const PendingUser = require('../models/PendingUser');
const People = require('../models/People');
const Room = require('../models/Room');

const tokenList = {};

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let emailVerification = new SibApiV3Sdk.SendSmtpEmail();
let confirmationEmail = new SibApiV3Sdk.SendSmtpEmail();
let passwordResetEmail = new SibApiV3Sdk.SendSmtpEmail();

exports.signup = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.data = errors.array();
		error.statusCode = 422;
		return next(error);
	}

	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;

	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const buffer = crypto.randomBytes(32);
		const token = buffer.toString('hex');

		const pendingUser = new PendingUser({
			username: username,
			email: email,
			password: hashedPassword,
			token: token,
			tokenTimeout: Date.now() + 3600000,
		});

		await pendingUser.save();

		res.status(201).json({
			message: 'Signup completed. Check your email for verification',
		});

		emailVerification = {
			to: [
				{
					email: email,
					name: username,
				},
			],
			templateId: 4,
			params: {
				FULLNAME: username,
				TOKEN: 'http://localhost:8080/auth/verification/' + token,
				EMAIL: email,
				SYNERGYURL: 'http://localhost:8080',
			},
		};

		const data = await apiInstance.sendTransacEmail(emailVerification);
		console.log('Confirmation Sent! Returned data ' + JSON.stringify(data));
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getVerfication = async (req, res, next) => {
	const token = req.params.token;

	try {
		const pendingUser = await PendingUser.findOne({
			token: token,
			tokenTimeout: { $gt: Date.now() },
		});

		if (!pendingUser) {
			const error = new Error('Invalid token or token timeout.');
			error.statusCode = 403;
			throw error;
		}

		const people = new People({
			username: pendingUser.username,
			email: pendingUser.email,
			password: pendingUser.password,
		});

		await people.save();
		await PendingUser.findOneAndDelete(pendingUser._id);

		res.status(200).json({
			message: 'Email verified!',
			verificationToken: token,
		});
		confirmationEmail = {
			to: [
				{
					email: people.email,
					name: people.username,
				},
			],
			templateId: 5,
			params: {
				FULLNAME: people.username,
				EMAIL: people.email,
				LOGIN: 'http://localhost:8080/login',
				SYNERGYURL: 'http://localhost:8080',
			},
		};
		const data = await apiInstance.sendTransacEmail(confirmationEmail);
		console.log('Confirmation Sent! Returned data ' + JSON.stringify(data));

		console.log('Email Verified!');
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.postlogin = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.data = errors.array();
		error.statusCode = 422;
		return next(error);
	}
	const email = req.body.email;
	const password = req.body.password;

	try {
		const people = await People.findOne({ email: email });

		const storedPasswored = people.password;
		const doMatch = await bcrypt.compare(password, storedPasswored);
		if (!doMatch) {
			const error = new Error('Password incorrect!');
			error.statusCode = 401;
			throw error;
		}

		const token = jwt.sign(
			{
				email: people.email,
				peopleId: people._id.toString(),
			},
			process.env.JWT_SECRET_KEY,
			{ expiresIn: process.env.JWT_TOKEN_TIMEOUT + 'h' }
		);

		const refreshToken = jwt.sign(
			{ email: people.email, peopleId: people._id.toString() },
			process.env.JWT_REFRESH_SECRET_KEY,
			{ expiresIn: process.env.JWT_REFRESH_TOKEN_TIMEOUT + 'h' }
		);

		tokenList[refreshToken] = {
			email: people.email,
			peopleId: people._id.toString(),
			token: token,
		};
		const rooms = await Room.find({
			$or: [
				{ creator: req.peopleId },
				{
					member: {
						peoples: { $elemMatch: { peopleId: req.peopleId } },
					},
				},
			],
		});

		res.status(200)
			.cookie('refreshToken', refreshToken, {
				httpOnly: true,
			})
			.cookie(
				'refreshTokenTimeout',
				process.env.JWT_REFRESH_TOKEN_TIMEOUT,
				{ httpOnly: true }
			)
			.json({
				message: 'Logged In!',
				peopleId: people._id,
				token: token,
				tokenTimeout: process.env.JWT_TOKEN_TIMEOUT,
			});

		console.log('A user just logged in.');
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.refreshToken = async (req, res, next) => {
	const authorization = req.get('Authorization');

	try {
		const refreshToken = authorization.split(' ')[1];

		if (refreshToken && refreshToken in tokenList) {
			const email = tokenList[refreshToken].email;
			const peopleId = tokenList[refreshToken].peopleId;

			const newToken = jwt.sign(
				{
					email: email,
					peopleId: peopleId,
				},
				process.env.JWT_SECRET_KEY,
				{ expiresIn: process.env.JWT_TOKEN_TIMEOUT + 'h' }
			);

			tokenList[refreshToken].token = newToken;
			res.status(200).json({
				token: newToken,
				tokenTimeout: process.env.JWT_TOKEN_TIMEOUT,
			});
		} else {
			res.status(404).json({
				message: 'Invalid request',
			});
		}
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.putResetPassword = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.data = errors.array();
		error.statusCode = 422;
		return next(error);
	}

	const email = req.body.email;

	try {
		const people = await People.findOne({ email: email });

		const buffer = await crypto.randomBytes(32);
		const token = buffer.toString('hex');
		people.resetToken = token;
		people.resetTokenTimeout = Date.now() + 3600000; // 1 hour
		await people.save();

		res.status(200).json({
			message: 'Reset link is sent to your email.',
		});

		passwordResetEmail = {
			to: [
				{
					email: email,
					name: people.username,
				},
			],
			templateId: 3,
			params: {
				FULLNAME: people.username,
				TOKEN: 'http://localhost:8080/auth/reset-now/' + token,
				BONGOBOOKSURL: 'http://localhost:8080',
				EMAIL: email,
			},
		};
		const data = await apiInstance.sendTransacEmail(passwordResetEmail);
		console.log('Reset Link Sent! Returned data ' + JSON.stringify(data));
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getResetNow = async (req, res, next) => {
	const token = req.params.token;
	try {
		const people = await People.findOne({
			resetToken: token,
			resetTokenTimeout: { $gt: Date.now() },
		});
		if (!people) {
			const error = new Error('Invalid token or token timeout.');
			error.statusCode = 401;
			throw error;
		}
		res.status(200).json({
			message: 'Email verified, proceeding to reset password...',
			resetToken: token,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.putResetNow = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error('Validation failed.');
		error.data = errors.array();
		error.statusCode = 422;
		return next(error);
	}

	const token = req.body.resetToken;
	const newPassword = req.body.newPassword;

	try {
		const people = await People.findOne({
			resetToken: token,
			resetTokenTimeout: { $gt: Date.now() },
		});
		if (!people) {
			const error = new Error('Invalid token or token timeout.');
			error.statusCode = 401;
			throw error;
		}

		const hashedPassword = await bcrypt.hash(newPassword, 12);

		people.password = hashedPassword;
		people.resetToken = null;
		people.resetTokenTimeout = null;
		await people.save();

		res.status(200).json({
			message: 'Password updated!',
		});
		console.log('Password changed UwU');
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
