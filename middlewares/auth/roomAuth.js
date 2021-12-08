const Room = require('../../models/Room');

exports.hasRoomAuth = async (req, res, next) => {
	const roomId = req.body.roomId;
	try {
		const room = await Room.findOne({
			_id: roomId,
			$or: [
				{ creator: req.peopleId },
				{
					'member.peoples': {
						$elemMatch: { peopleId: req.peopleId },
					},
				},
			],
		});
		if (!room) {
			return res.status(404).json({
				message: 'Unauthorized or not found',
			});
		}
		next();
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.isRoomAdmin = async (req, res, next) => {
	const roomId = req.body.roomId;
	try {
		const room = await Room.findOne({
			_id: roomId,
			$or: [{ creator: req.peopleId }],
		});
		if (!room) {
			return res.status(404).json({
				message: 'Unauthorized or not found',
			});
		}
		next();
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
