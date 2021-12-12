const People = require('../models/People');

exports.getPeople = async (req, res, next) => {
	const { key } = req.query;
	try {
		const people = await People.find({
			$or: [
				{ username: { $regex: key, $options: 'i' } },
				{ email: { $regex: key, $options: 'i' } },
				{ firstName: { $regex: key, $options: 'i' } },
				{ lastName: { $regex: key, $options: 'i' } },
			],
		}).select('username avatar _id email');
		res.status(201).json({
			people: people,
		});
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
