const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema(
	{
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
		},
	},
	{
		timestamps: true,
	}
);

roomSchema.methods.addPeople = function (people, role) {
	const updatedRoom = this;
	console.log(updatedRoom);
	updatedRoom.member.peoples.push({
		peopleId: people._id,
		role: role || 'member',
	});
	return this.save();
};

module.exports = mongoose.model('Room', roomSchema);
