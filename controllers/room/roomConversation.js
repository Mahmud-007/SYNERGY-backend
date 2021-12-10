const People = require('../../models/People');
const Room = require('../../models/Room');
const RoomMessage = require('../../models/RoomMessage');

exports.getRoomConversations = async (req, res, next) => {
	const roomId = req.params.roomId;

	try {
		const room = await Room.findById(roomId);
		if (!room) {
			return res.status(404).json({
				message: `Room of id ${roomId} not found`,
			});
		}
		const roomConversations = await RoomMessage.find({
			roomId: room._id,
		})
			.populate('senderId', 'avatar, username')
			.exec();
		res.status(200).json({
			roomMessages: roomConversations,
		});
	} catch (err) {}
};

exports.sendRoomMessage = async (req, res, next) => {
	const roomId = req.body.roomId || req.params.roomId;
	const text = req.body.text;

	try {
		const sender = await People.findById(req.peopleId);
		const room = await Room.findById(roomId);
		if (!room) {
			return res.status(404).json({
				message: 'Room not found',
			});
		}
		const roomMessage = new RoomMessage({
			roomId: room._id,
			senderId: sender._id,
			message: text,
		});

		await roomMessage.save();

		res.status(201).json({
			message: 'Room message sent',
			text: text,
			roomId: room._id,
			senderAvatar: sender.avatar,
			senderName: sender.username,
			senderId: sender._id.toString(),
		});
	} catch (err) {}
};
