const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')
const ObjectId = require('mongodb').ObjectID

module.exports = class UpdateOrderStatusRepository {
  async update (orderStatus, orderId) {
    if (!orderStatus) {
      throw new MissingParamError('orderStatus')
    }

    if (!orderId) {
      throw new MissingParamError('orderId')
    }

    const orderModel = await MongoHelper.getCollection('orders')

    const filter = { _id: ObjectId(orderId) }
    const updateDoc = {
      $set: {
        orderStatus
      }
    }
    const result = await orderModel.updateOne(filter, updateDoc)
    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`)
    return {}
  }
}
