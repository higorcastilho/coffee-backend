const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')

module.exports = class UpdateOrderStatusRepository {
  async update (orderStatus, orderId) {
    if (!orderStatus) {
      throw new MissingParamError('orderStatus')
    }

    if (!orderId) {
      throw new MissingParamError('orderId')
    }

    const orderModel = await MongoHelper.getCollection('orders')

    const order = await orderModel.find(`{ _id: ${orderId}}`)
    const orderArray = await order.toArray()
    await orderModel.updateOne({ _id: orderArray[0]._id }, { $set: { orderStatus: orderStatus } })

    return {}
  }
}
