const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const pendingUserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    tokenTimeout: {
        type: Schema.Types.Date,
        required: true,
    }
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);