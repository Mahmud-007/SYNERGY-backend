const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomMessageSchema = mongoose.Schema(
	{
		roomId: {
			type: Schema.Types.ObjectId,
			ref: 'Room',
			required: true,
		},
		senderId: {
			type: Schema.Types.ObjectId,
			ref: 'People',
			required: true,
		},
		message: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const RoomMessage = mongoose.model('RoomMessage', roomMessageSchema);

module.exports = RoomMessage;
