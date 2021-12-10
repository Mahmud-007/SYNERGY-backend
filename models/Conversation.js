const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const conversationSchema = mongoose.Schema(
	{
		senderId: {
			type: Schema.Types.ObjectId,
			ref: 'People',
			required: true,
		},
		receiverId: {
			type: Schema.Types.ObjectId,
			ref: 'People',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
