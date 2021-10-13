const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const isAuth = require('../middlewares/auth/isAuth');


router.get('/login', loginController);

module.exports = router;