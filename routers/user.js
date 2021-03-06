const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const isAuth = require('../middlewares/auth/isAuth');

// GET -> /user/profile
router.get('/profile', isAuth, userController.getProfile);

// GET -> /user/tasks
router.get('/tasks', isAuth, userController.getTaskAssigned);

// PUT -> /user/profile
router.put('/profile', isAuth, userController.updateProfile);

module.exports = router;
