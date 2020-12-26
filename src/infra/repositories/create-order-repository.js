const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')

module.exports = class CreateOrderRepository {
  async create (paymentMethod, price, quantity, orderStatus, customerId) {
    if (!paymentMethod) {
      throw new MissingParamError('payment method')
    }

    if (!price) {
      throw new MissingParamError('price')
    }

    if (!quantity) {
      throw new MissingParamError('quantity')
    }

    if (!orderStatus) {
      throw new MissingParamError('order status')
    }

    if (!customerId) {
      throw new MissingParamError('customer id')
    }

    const orderModel = await MongoHelper.getCollection('orders')
    const order = await orderModel.insertOne({
      paymentMethod,
      price,
      quantity,
      orderStatus,
      customerId,
      createdAt: new Date()
    })

    return order.ops[0]
  }
}
