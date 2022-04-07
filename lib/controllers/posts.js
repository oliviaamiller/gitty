const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router()
  .get('/', authenticate, (req, res, next) => {
    Post.getAll()
      .then((posts) => res.send(posts))
      .catch((error) => next(error));
  })

  .post('/', authenticate, (req, res, next) => {
    Post.insert({
      ...req.body,
      username: req.user.username,
      email: req.user.email,
    })
      .then((post) => res.send(post))
      .catch((error) => next(error));
  });
