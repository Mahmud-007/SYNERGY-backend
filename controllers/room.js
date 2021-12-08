const People = require('../models/People');
const Room = require('../models/Room');

exports.createRoom = async (req, res, next) => {
	const roomName = req.body.roomName;
	try {
		const people = await People.findById(req.peopleId);

		if (!people) {
			const err = new Error('People not found');
			err.statusCode = 404;
			throw err;
		}
		const room = new Room({
			name: roomName,
			creator: people._id,
		});
		await room.save();
		res.status(201).json({
			message: 'Room created!',
			roomName: room.name,
			roomId: room._id,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.sendInvationToRoom = async (req, res, next) => {
	const newPeopleId = req.body.peopleId;
	const roomId = req.body.roomId;
	try {
		const newPeople = await People.findById(newPeopleId);
		if (!newPeople) {
			return res.status(404).json({
				message: 'People not found!',
			});
		}
		const room = await Room.findById(roomId);
		if (!room) {
			return res.status(404).json({
				message: 'Room not found!',
			});
		}
		await room.addPeople(newPeople);
		res.status(201).json({
			message: `${newPeopleId} is added to room ${room._id}`,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
