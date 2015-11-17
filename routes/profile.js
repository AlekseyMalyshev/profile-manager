'use strict';

let express = require('express');
let router = express.Router();

let User = require('../models/user');

router.get('/', (req, res) => {
  let id = req.cookies.userId;
  console.log(id);

  if (id === undefined) {
    res.status(401).send('');
  }
  else {
    User.findOne({_id: id}, (err, user) => {
      if (err) {
        res.status(401).send('');
      }
      else {
        res.render('profile', {user: user});
      }
    });
  }
});

module.exports = router;
