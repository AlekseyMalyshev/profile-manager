'use strict';

let express = require('express');
let router = express.Router();

let User = require('../models/user');

router.get('/', (req, res) => {
  res.render('message');
});

module.exports = router;
