const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room');

const roomAuth = require('../middlewares/auth/roomAuth');

const isAuth = require('../middlewares/auth/isAuth');

//PUT -> /room/create {body -> roomName}
router.put('/create', isAuth, roomController.createRoom);

// PUT -> /room/invitation {body -> peopleInfo(username or email), role, roomId}
router.put(
	'/invitation',
	isAuth,
	roomAuth.isRoomAdmin,
	roomController.sendInvationToRoom
);

// GET -> /room/invitation/verify/:token
router.get('/invitation/verify/:token', roomController.addPeopleToRoom);

module.exports = router;
