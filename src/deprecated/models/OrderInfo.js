const mongoose = require('mongoose')
const { Schema } = mongoose

const orderInfoSchema = new Schema({
  _id: Schema.Types.ObjectId,
  paymentMethod: String,
  orderNumber: String,
  price: Number,
  quantity: Number,
  date: { type: Date, default: Date.now },
  orderStatus: String, // 0 - canceled, 1 - confirmed, 2 - pending
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' }
})

module.exports = mongoose.model('OrderInfo', orderInfoSchema)
