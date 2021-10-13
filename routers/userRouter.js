const express = require("express");
const router = express.Router();
const {getUsers, addUser} = require("../controllers/userController");
const isAuth = require('../middlewares/auth/isAuth');


router.get('/users', getUsers);

router.post('/add-user',addUser);

module.exports = router;