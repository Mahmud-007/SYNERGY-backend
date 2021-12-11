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
	'/one/:roomId',
	isAuth,
	roomAuth.hasRoomAuth,
	roomController.getRoom
);

// POST -> /room/:roomId/task/create {body -> assignedTo(username or email), role, taskName, taskDescription }
router.post(
	'/:roomId/task/create',
	isAuth,
	roomAuth.hasRoomAuth,
	taskController.createTask
);

// GET -> /room/all
router.get('/all', isAuth, roomController.getAllRoom);

// DELETE -> /room/delete {body -> roomId}
router.delete(
	'/:roomId/delete',
	isAuth,
	roomAuth.isRoomAdmin,
	roomController.deleteRoom
);

// DELETE -> /room/task/delete {body -> roomId}
router.delete(
	'/:roomId/task/delete',
	isAuth,
	roomAuth.hasRoomAuth,
	taskController.deleteTask
);

// PUT -> /room/task/complete
router.put(
	'/:roomId/task/complete',
	isAuth,
	roomAuth.hasRoomAuth,
	taskController.taskComplete
);

// GET -> /room/:roomId/my-tasks
router.get(
	'/:roomId/my-tasks',
	isAuth,
	roomAuth.hasRoomAuth,
	taskController.getTaskAssigned
);

// GET -> /room/:roomId/my-tasks
router.get(
	'/:roomId/tasks',
	isAuth,
	roomAuth.hasRoomAuth,
	taskController.getAllTasks
);

module.exports = router;
