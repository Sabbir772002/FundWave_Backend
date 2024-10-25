const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  id : String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  id: {type: String,unique:true},
  password: String,
  bkash: String,
  nagad: String,
  rocket: String,
  img: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
