const People = require('../models/People');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { findById } = require('../models/People');

exports.initConversation = async (req, res, next) => {
	const receiverId = req.body.receiverId;

	try {
		const sender = await People.findById(req.peopleId);
		if (!sender) {
			const err = new Error('User error.');
			err.statusCode = 404;
			throw err;
		}
		const receiver = await People.findById(receiverId);
		if (!receiver) {
			return res.status(404).json({
				message: `Reciever not found.`,
				receiverId: receiverId,
			});
		}

		let conversation = await Conversation.findOne({
			$or: [
				{
					senderId: sender._id,
					receiverId: receiver._id,
				},
				{
					receiverId: sender._id,
					senderId: receiver._id,
				},
			],
		});
		if (!conversation) {
			conversation = new Conversation({
				senderId: sender._id,
				receiverId: receiver._id,
			});
			await conversation.save();
		}
		const messages = await Message.find({
			conversationId: conversation._id,
		});

		res.status(201).json({
			conversationId: conversation._id.toString(),
			messages: messages,
			senderAvater: sender.avatar,
			receiverAvater: receiver.avatar,
			receiverName: receiver.name,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.sendMessage = async (req, res, next) => {
	const receiverId = req.body.receiverId;
	const text = req.body.text;

	try {
		const sender = await People.findById(req.peopleId);
		if (!sender) {
			const err = new Error('User error.');
			err.statusCode = 404;
			throw err;
		}

		const receiver = await People.findById(receiverId);
		if (!receiver) {
			return res.status(404).json({
				message: `Reciever not found.`,
				receiverId: receiverId,
			});
		}

		let conversation = await Conversation.findOne({
			$or: [
				{
					senderId: sender._id,
					receiverId: receiver._id,
				},
				{
					receiverId: sender._id,
					senderId: receiver._id,
				},
			],
		});
		if (!conversation) {
			conversation = new Conversation({
				senderId: sender._id,
				receiverId: receiver._id,
			});
			await conversation.save();
		}
		const message = new Message({
			conversationId: conversation._id,
			senderId: req.peopleId,
			receiverId: receiverId,
			message: text,
		});
		await message.save();
		res.status(201).json({
			message: 'Message is sent',
			conversationId: conversation._id,
			receiverId: receiverId,
			senderId: req.peopleId,
			text: text,
			senderAvater: sender.avatar,
			receiverAvater: receiver.avatar,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
