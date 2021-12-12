const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema(
	{
		roomId: {
			type: Schema.Types.ObjectId,
			ref: 'Room',
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'People',
			required: true,
		},
		assignedTo: {
			peopleId: {
				type: Schema.Types.ObjectId,
				ref: 'People',
				required: true,
			},
			role: {
				type: String,
			},
		},
		isCompleted: {
			type: Boolean,
			required: true,
			default: false,
		},
		deadline: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Task', taskSchema);
