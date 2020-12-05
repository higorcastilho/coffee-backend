const Customer = require('../../../models/Customer')
const OrderInfo = require('../../../models/OrderInfo')
const mongoose = require('mongoose')

class CustomerOrderController {
  async showOrders (req, res) {
    const orders = await OrderInfo
      .find({}, null, { limit: 6, sort: { date: -1 } })
      .populate('customer')
      .exec()

    res.send(orders)
  }

  async createOrder (req, res) {
    const {
      name,
      email,
      phone,
      address,
      zip,
      paymentMethod,
      orderNumber,
      price,
      quantity,
      orderStatus // 0 - canceled, 1 - confirmed, 2 - pending
    } = req.body.orderInfo

    const customerId = await Customer.findOne({ email }, '_id ').exec()

    if (customerId) {
      const orderInfo = new OrderInfo({
        _id: new mongoose.Types.ObjectId(),
        paymentMethod,
        orderNumber,
        price,
        quantity,
        orderStatus,
        customer: customerId
      })

      orderInfo.save(function (err) {
        if (err) console.log(err)
        res.json({ orderId: orderInfo._id })
      })

      return true
    }

    const customer = new Customer({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      phone,
      address,
      zip
    })

    customer.save(function (err) {
      if (err) console.log(err)

      const orderInfo = new OrderInfo({
        _id: new mongoose.Types.ObjectId(),
        paymentMethod,
        orderNumber,
        price,
        quantity,
        orderStatus,
        customer: customer._id
      })

      orderInfo.save(function (err) {
        if (err) console.log(err)
        res.json({ orderId: orderInfo._id })
        return true
      })
    })
  }

  async showCustomerOrders (req, res) {
    const { customerId } = req.params
    console.log(customerId)
    await OrderInfo
      .find({ customer: customerId })
      .exec(function (err, order) {
        if (err) console.log(err)

        console.log(order)
      })
  }

  async updateOrderStatus (req, res) {
    const { success, canceled, orderId } = req.body

    const filter = { _id: orderId }

    if (success && !canceled) {
      const update = { orderStatus: 'Confimado' }
      await OrderInfo.findOneAndUpdate(filter, update)
    }

    if (!success && canceled) {
      const update = { orderStatus: 'Cancelado' }
      await OrderInfo.findOneAndUpdate(filter, update)
    }
  }
}

module.exports = CustomerOrderController
