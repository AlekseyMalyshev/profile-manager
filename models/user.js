
'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
    name: {type: String, required: true},
    pass: {type: String, required: true},
    email: String,
    address: String,
    zipcode: String,
    phone: String,
    city: String,
    state: String,
    avatar: String,
    updated: {type: Date, default: Date.now},
  });

userSchema.methods.encryptPass = function(cb) {
  bcrypt.genSalt(10, (err1, salt) => {
    bcrypt.hash(this.pass, salt, (err2, hash) => {
      if (err1 || err2) {
        cb(err1 || err2);
      }
      else {
        this.pass = hash;
        cb(null);
      }
    });
  });
}

userSchema.methods.comparePass = function(pass, cb) {
  bcrypt.compare(pass, this.pass, (err, result) => {
    if (!err && result) {
      cb(err, this);
    }
    else {
      cb('invalid credentials');
    }
  });
}

module.exports = mongoose.model('users', userSchema);
