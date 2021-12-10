const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = mongoose.Schema(
	{
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: 'Conversation',
			required: true,
		},
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
		message: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
