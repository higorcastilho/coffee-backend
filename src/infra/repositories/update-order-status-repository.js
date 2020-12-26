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
    await orderModel
      .updateOne({
        _id: orderId
      }, {
        $set: {
          orderStatus
        }
      })

    return {}
  }
}
