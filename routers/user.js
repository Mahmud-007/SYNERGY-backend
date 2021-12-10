const express = require("express");
const router = express.Router();
const {getUsers, addUser} = require("../controllers/user");
const isAuth = require('../middlewares/auth/isAuth');




module.exports = router;