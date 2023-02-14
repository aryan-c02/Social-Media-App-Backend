const express = require('express');
const { createPost, likePostUnlikePost, DeletePost, getPostOfFollowing } = require('../Controllers/post');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// in the post we will pass a function 
// which is created in the controllers folder
router.route("/post/upload").post(isAuthenticated, createPost);

router.route("/post/:id").get(isAuthenticated, likePostUnlikePost);

router.route("/post/:id").delete(isAuthenticated, DeletePost);

router.route("/posts").get(isAuthenticated, getPostOfFollowing);

module.exports = router;
