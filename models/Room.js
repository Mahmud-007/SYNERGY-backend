const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: 'People',
		required: true,
	},
	member: {
		peoples: [
			{
				peopleId: {
					type: Schema.Types.ObjectId,
					ref: 'People',
					required: true,
				},
				role: {
					type: String,
					default: 'member',
				},
			},
		],
		pendingPeoples: [
			{
				peopleId: {
					type: Schema.Types.ObjectId,
					ref: 'People',
					required: true,
				},
				role: {
					type: String,
					default: 'member',
				},
			},
		],
	},
});

roomSchema.methods.addPeople = function (people) {
	const updatedRoom = this;
	console.log(updatedRoom);
	updatedRoom.member.peoples.push({
		peopleId: people._id,
		role: people.role || 'member',
	});
	return this.save();
};

roomSchema.methods.addPendingPeople = function (people) {
	const updatedRoom = this;
	console.log(this);
	updatedRoom.member.pendingPeoples.push({
		peopleId: people._id,
		role: people.role || 'pending',
	});
	return this.save();
};

module.exports = mongoose.model('Room', roomSchema);
