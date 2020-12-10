
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  title: {type: String},
  imageUrl: {type: String},
  owner: {type: Schema.Types.ObjectId, ref: 'User'},
  owner_name: {type: String},
  interestedUsers: {type: [Object]}
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book