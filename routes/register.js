'use strict';

let express = require('express');
let router = express.Router();

let User = require('../models/user');

router.get('/', (req, res) => {
  res.render('register');
});

module.exports = router;
