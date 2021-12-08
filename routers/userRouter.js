const express = require("express");
const router = express.Router();
const {getUsers, addUser} = require("../controllers/userController");
const isAuth = require('../middlewares/auth/isAuth');




module.exports = router;