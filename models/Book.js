
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bookSchema = new Schema({
  title: {type: String},
  image_name: {type: String},
  image_path: {type: String},
  owner: {type: Schema.Types.ObjectId, ref: 'User'}
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book