const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const isAuth = require('../middlewares/auth/isAuth');

// GET -> /user/profile
router.get('/profile', isAuth, userController.getProfile);

module.exports = router;
