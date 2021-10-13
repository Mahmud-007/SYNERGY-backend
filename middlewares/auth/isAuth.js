const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authorization = req.get('Authorization');
    if (!authorization) {
        const error = new Error("No token found.");
        error.statusCode = 401;
        throw error;
    }
    const token = authorization.split(' ')[1];

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        err.statusCode = 500;
        next(err);
    }

    if (!decodedToken) {
        const error = new Error("Not authorized!");
        error.statusCode = 401;
        throw error;
    }

    req.peopleId = decodedToken.peopleId;
    next();
}