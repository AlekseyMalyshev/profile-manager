'use strict';

let express = require('express');
let jwt = require('express-jwt');
let router = express.Router();

let User = require('../models/user');

let checkError = (err, res, user) => {
  if (err) {
    console.log('err: ', err);
    res.status(400).send(err);
  }
  else {
    res.json(user);
  }
}

router.post('/register', (req, res) => {
  User.findOne({name: req.body.name}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (user !== null) {
      res.status(401).send('User already exists');
    }
    else {
      let user = new User(req.body);
      user.encryptPass((err) => {
        if (err) {
          res.status(500).send('Encryption failed');
        }
        else {
          user.save((err, doc) => {
            if (!err) {
              doc.pass = null;
            }
            checkError(err, res, doc);
          });
        }
      });
    }
  });
});

router.post('/authenticate', (req, res) => {
  User.findOne({name: req.body.name}, (err, user) => {
    if (err) {
      checkError(err, res);
    }
    else if (user === null) {
      res.status(404).send('Authentication failed');
    }
    else {
      user.comparePass(req.body.pass, (err) => {
        if (err) {
          res.status(404).send('Authentication failed');
        }
        else {
          user.pass = null;
          res.cookie('userId', user._id, { maxAge: 900000, httpOnly: true });
          res.json(user);
        }
      });
    }
  });
});

router.get('/me', (req, res) => {
  let id = req.cookies.userId;
  console.log('id', id);
  if (!id) {
    res.status(401).send('Not authenticated');
  }
  else {
    User.findOne({_id: id}, (err, user) => {
      if (err) {
        checkError(err, res);
      }
      else if (!user) {
        res.status(401).send('Not authenticated');
      } 
      else {
        res.json(user);
      }
    });
  }
});

router.put('/me', (req, res) => {
  let id = req.cookies.userId;
  console.log('id', id);
  if (!id) {
    res.send('');
  }
  else {
    let user = new User(req.body);
    user._id = id;
    console.log(user);
    user.encryptPass((err) => {
      if (err) {
        checkError(err, res);
      }
      else {
        User.findOneAndUpdate({_id: id}, user, (err, doc) => {
          if (err) {
            checkError(err, res);
          }
          else {
            res.json('');
          }
        });
      }
    });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.send('');
});

module.exports = router;
