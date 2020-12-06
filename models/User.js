  
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true, minlength: 8},
  name: {type: String},
  city: {type: String},
  interests: {type: String},
  myBooks: {type: [String]},
  wishList: {type: [String]},
})

const User = mongoose.model('User', userSchema)

module.exports = User