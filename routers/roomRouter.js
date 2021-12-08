const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room');

const roomAuth = require('../middlewares/auth/roomAuth');

const isAuth = require('../middlewares/auth/isAuth');

router.put('/create', isAuth, roomController.createRoom);

router.put(
	'/add-people',
	isAuth,
	roomAuth.isRoomAdmin,
	roomController.sendInvationToRoom
);

module.exports = router;
