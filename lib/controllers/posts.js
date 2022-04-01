const { Router } = require('express');
const authenticate = require('../middleware/authenicate');

module.exports = Router()
  .get('/posts', authenticate, async (req, res) => {
    res.json(req.user);
  });
