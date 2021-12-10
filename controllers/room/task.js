const People = require('../../models/People');
const Task = require('../../models/Task');

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
