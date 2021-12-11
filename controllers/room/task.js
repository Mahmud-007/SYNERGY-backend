const People = require('../../models/People');
const Task = require('../../models/Task');
const mongoose = require('mongoose');

exports.createTask = async (req, res, next) => {
	const roomId = req.body.roomId || req.params.roomId;
	const assignedTo = req.body.assignedTo;
	const role = req.body.role;
	const taskName = req.body.taskName;
	const taskDescription = req.body.taskDescription;

	try {
		const people = await People.findOne({
			$or: [{ email: assignedTo }, { username: assignedTo }],
		});
		if (!people) {
			return res.status(404).json({
				message: 'People not found!',
			});
		}
		const peoples = [
			{
				peopleId: people._id,
				role: role,
			},
		];
		const task = new Task({
			roomId: roomId,
			createdBy: req.peopleId,
			name: taskName,
			description: taskDescription,
			assignedTo: {
				peoples: peoples,
			},
		});
		await task.save();

		res.status(201).json({
			message: 'Task created.',
			roomId: roomId,
			createdBy: req.peopleId,
			taskName: taskName,
			taskDescription: taskDescription,
			assignedTo: {
				peoples: peoples,
			},
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.deleteTask = async (req, res, next) => {
	const taskId = req.body.taskId;
	try {
		const task = await Task.findOne({
			_id: taskId,
			createdBy: req.peopleId,
		});
		if (!task) {
			return res.status(422).json({
				message: 'Only task creator can delete task or task not found',
			});
		}
		await Task.deleteOne({ _id: taskId });

		res.status(202).json({
			message: `Task ${taskId} is deleted`,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.taskComplete = async (req, res, next) => {
	const taskId = req.body.taskId;
	try {
		const task = await Task.findOne({
			_id: taskId,
			$or: [
				{ createdBy: req.peopleId },
				{
					assignedTo: {
						peoples: { $elemMatch: { peopleId: req.peopleId } },
					},
				},
			],
		});
		if (!task) {
			return res.status(422).json({
				message: 'Only task creator or assigned can update task',
			});
		}
		task.isCompleted = true;
		await task.save();
		res.status(202).json({
			message: 'Task completed',
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getTaskAssigned = async (req, res, next) => {
	const roomId = req.body.roomId || req.params.roomId;
	try {
		const tasks = await Task.find({
			// roomId: roomId,
			assignedTo: {
				peoples: {
					$elemMatch: {
						peopleId: req.peopleId,
					},
				},
			},
		});

		res.status(200).json({
			message: 'room user tasks fetched',
			assignedTo: req.peopleId,
			roomId: roomId,
			tasks: tasks,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getAllTasks = async (req, res, next) => {
	const roomId = req.body.roomId || req.params.roomId;
	try {
		const tasks = await Task.find({
			roomId: roomId,
		});

		res.status(200).json({
			message: 'room tasks fetched',
			roomId: roomId,
			tasks: tasks,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
