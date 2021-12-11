const SibApiV3Sdk = require('sib-api-v3-sdk');
const crypto = require('crypto');

const People = require('../../models/People');
const Room = require('../../models/Room');
const RoomInvitation = require('../../models/RoomInvitation');
const mongoose = require('mongoose');
const Task = require('../../models/Task');

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let roomInvitationEmail = new SibApiV3Sdk.SendSmtpEmail();

exports.createRoom = async (req, res, next) => {
	const roomName = req.body.roomName;
	try {
		const people = await People.findById(req.peopleId);

		if (!people) {
			const err = new Error('People not found');
			err.statusCode = 404;
			throw err;
		}
		let room = Room.findOne({
			creator: people._id,
			name: roomName,
		});
		if (room) {
			return res.status(422).json({
				message: `You already have a room with the name ${roomName}`,
			});
		}
		room = new Room({
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
	const peopleInfo = req.body.peopleInfo;
	const role = req.body.role;
	const roomId = req.body.roomId;
	try {
		const buffer = crypto.randomBytes(32);
		const token = buffer.toString('hex');

		const adminPeople = await People.findById(req.peopleId);
		if (!adminPeople) {
			return res.status(404).json({
				message: 'People not found!',
			});
		}
		const newPeople = await People.findOne({
			$or: [{ email: peopleInfo }, { username: peopleInfo }],
		});
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
		let roomInvitation = await RoomInvitation.findOne({
			peopleId: newPeople._id,
			roomId: room._id,
		});
		if (roomInvitation) {
			roomInvitation.token = token;
			roomInvitation.role = role || 'member';
		} else {
			roomInvitation = new RoomInvitation({
				peopleId: newPeople._id,
				roomId: room._id,
				role: role || 'member',
				token: token,
			});
		}

		await roomInvitation.save();

		roomInvitationEmail = {
			to: [
				{
					email: newPeople.email,
					name: newPeople.username,
				},
			],
			templateId: 7,
			params: {
				FIRSTNAME: adminPeople.firstName,
				LASTNMAE: adminPeople.lastName,
				JOINROOM:
					'http://localhost:8080/room/invitation/verify/' + token,
				EMAIL: newPeople.email,
				SYNERGYURL: 'http://localhost:3000',
			},
		};

		const data = await apiInstance.sendTransacEmail(roomInvitationEmail);
		console.log('Confirmation Sent! Returned data ' + JSON.stringify(data));

		res.status(201).json({
			message: `Invitation to room ${room.name} is sent to ${newPeople.username}`,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.addPeopleToRoom = async (req, res, next) => {
	const token = req.params.token;
	try {
		const roomInvitation = await RoomInvitation.findOne({
			token: token,
		});
		if (!roomInvitation) {
			return res.status(404).json({
				message: 'Invitation not valid',
			});
		}
		const people = await People.findById(roomInvitation.peopleId);
		if (!people) {
			return res.status(404).json({
				message: 'People from the invitation not found',
			});
		}
		const room = await Room.findById(roomInvitation.roomId);
		if (!room) {
			return res.status(404).json({
				message: 'Room from the invitation not found',
			});
		}
		await room.addPeople(people, roomInvitation.role);
		res.status(201).json({
			message: `${people.username} is added to room ${room.name}`,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getRoom = async (req, res, next) => {
	const roomId = req.params.roomId;
	try {
		const room = await Room.findById(roomId);
		if (!room) {
			return res.status(404).json({
				message: `Room with id ${roomId} not found`,
			});
		}
		const tasks = await Task.find({
			roomId: roomId,
		});
		res.status(200).json({
			message: 'Success',
			room: room,
			tasks: tasks,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getAllRoom = async (req, res, next) => {
	try {
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

		res.status(200).json({
			message: 'Your room are fetched',
			rooms: rooms,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.deleteRoom = async (req, res, next) => {
	const roomId = req.body.roomId || req.params.roomId;
	try {
		await Room.deleteOne({ _id: roomId });

		res.status(202).json({
			message: `Room ${roomId} is deleted`,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
