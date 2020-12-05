const mongoose = require('mongoose')
const { Schema } = mongoose

const customerSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  zip: String,
  date: { type: Date, default: Date.now }
  // orders: [{ type: Schema.Types.ObjectId, ref: 'OrderInfo' }]
})

module.exports = mongoose.model('Customer', customerSchema)
