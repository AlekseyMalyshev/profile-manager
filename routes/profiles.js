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
    User.find({_id: { $ne: id } }, (err, users) => {
      if (err) {
        res.status(401).send('');
      }
      else {
        res.render('profiles', {users: users});
      }
    });
  }
});

module.exports = router;
