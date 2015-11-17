'use strict';

let express = require('express');
let router = express.Router();

let Message = require('../models/message');

let checkError = (err, res, message) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(message);
  }
}

router.post('/:toId', (req, res) => {
  let message = new Message(req.body);
  console.log('Adding message: ', message);
  message.save((err, message) => {
    checkError(err, res, '');
  });
});

router.get('/:toId', (req, res) => {
  var id = req.params.toId;
  console.log('Finding messages for user: ', id);
  Message.find({to: id}, null, {sort: '-updated'})
    .populate('from')
    .exec((err, messages) => {
      checkError(err, res, messages);
    });
});

router.delete('/:id', (req, res) => {
  console.log('Deleting message with id: ', id);
  Message.findOneAndRemove({_id: id}, (err, message) => {
    checkError(err, res, '');
  });
});

module.exports = router;
