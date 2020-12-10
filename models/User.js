  
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true, minlength: 8},
  name: {type: String},
  city: {type: String, required: true},
  interests: {type: String},
  myBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  wishList: [{type: Schema.Types.ObjectId, ref: 'Book'}],
  myExchanges: [{type: Schema.Types.ObjectId, ref: 'Exchange'}],
})

const User = mongoose.model('User', userSchema)

module.exports = User