const express = require('express');
const isAuth = require('../middlewares/auth/isAuth');
const router = express.Router();

const conversationController = require('../controllers/Conversation');

// PUT -> /conversation/messages {body -> receiverId}
router.put('/messages', isAuth, conversationController.initConversation);

// PUT -> /conversation/new-message {body -> receiverId, text}
router.post('/new-message', isAuth, conversationController.sendMessage);

module.exports = router;
