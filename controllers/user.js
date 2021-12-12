const path = require('path');
const bcrypt = require('bcrypt');

//internal imports
const People = require('../models/People');
const Task = require('../models/Task');
const Room = require('../models/Room');

exports.getProfile = async (req, res, next) => {
	try {
		const people = await People.findById(req.peopleId);
		if (!people) {
			const err = new Error('User not found');
			err.statusCode = 404;
			throw err;
		}

		res.status(200).json({
			peopleId: people._id,
			username: people.username,
			firstName: people.FirstName,
			lastName: people.LastName,
			avatar: people.avatar,
			email: people.email,
			role: people.role,
			createdAt: people.createdAt,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getTaskAssigned = async (req, res, next) => {
	try {
		const tasks = await Task.find({
			'assignedTo.peopleId': req.peopleId,
		})
			.populate('roomId', 'name description')
			.exec();
		res.status(200).json({
			message: 'user tasks fetched',
			tasks: tasks,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
