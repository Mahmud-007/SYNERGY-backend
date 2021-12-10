const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room/room');
const roomConversationController = require('../controllers/room/roomConversation');
const taskController = require('../controllers/room/task');

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

// GET -> /room/:roomId/messages
router.get(
	'/:roomId/messages',
	isAuth,
	roomAuth.hasRoomAuth,
	roomConversationController.getRoomConversations
);

// POST -> /room/:roomId/new-message {body -> text}
router.post(
	'/:roomId/new-message',
	isAuth,
	roomAuth.hasRoomAuth,
	roomConversationController.sendRoomMessage
);

// GET -> /room/:roomId
router.get(
	'/:roomId',
	isAuth,
	roomAuth.hasRoomAuth,
	roomController.getRoom
);

// POST -> /room/:roomId/create-task {body -> assignedTo(username or email), role, taskName, taskDescription }
router.post(
	'/:roomId/create-task',
	isAuth,
	roomAuth.hasRoomAuth,
	taskController.createTask
);

module.exports = router;
