const mongoose = require('mongoose')
const Schema = mongoose.Schema

const exchangeSchema = new Schema({
  userPartner: {type: String},
  borrowed: {type: [Object]},
  acquired: {type: [Object]},
})

const Exchange = mongoose.model('Exchange', exchangeSchema)

module.exports = Exchange