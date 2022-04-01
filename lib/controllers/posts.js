const { Router } = require('express');
const authenticate = require('../middleware/authenicate');
const Post = require('../models/Post');

module.exports = Router()
  .get('/posts', authenticate, async (req, res, next) => {
    try {
      const posts = await Post.getAll();
      res
        .json(req.user)
        .send(posts);
    } catch (error) {
      next(error);
    }
  });
