const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room');

const roomAuth = require('../middlewares/auth/roomAuth');

const isAuth = require('../middlewares/auth/isAuth');

router.put('/create', isAuth, roomController.createRoom);

router.put(
	'/invitation',
	isAuth,
	roomAuth.isRoomAdmin,
	roomController.sendInvationToRoom
);

router.get('/invitation/verify/:token', roomController.addPeopleToRoom);

module.exports = router;
