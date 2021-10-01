const express = require("express");
const router = express.Router();
const {getUsers, addUser} = require("../controllers/userController");


router.get('/users', getUsers);

router.post('/add-user',addUser);

module.exports = router;