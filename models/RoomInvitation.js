const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomInvitaionSchema = new Schema({
	peopleId: {
		type: Schema.Types.ObjectId,
		ref: 'People',
		required: true,
	},
	roomId: {
		type: Schema.Types.ObjectId,
		ref: 'Room',
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: 'member',
	},
});

module.exports = mongoose.model('RoomInvitation', roomInvitaionSchema);
