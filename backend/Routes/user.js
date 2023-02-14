const express = require('express');
const { register, login, logout, followUsers, myProfile, updatePassword, updateProfile, getProfile } = require('../Controllers/user');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(logout);
 
router.route("/follow/:id").get(isAuthenticated ,followUsers);

router.route("/me").get(isAuthenticated, myProfile);

router.route("/update/Password").put(isAuthenticated, updatePassword);

router.route("/update/Profile").put(isAuthenticated, updateProfile);

router.route("/me").get(isAuthenticated, myProfile);

router.route("/findUser/:id").get( isAuthenticated,getProfile);

module.exports = router;