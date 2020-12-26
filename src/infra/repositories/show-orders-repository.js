const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')

module.exports = class ShowOrdersRepository {
  async show (limit, offset) {
    if (!limit) {
      throw new MissingParamError('limit')
    }

    if (!offset) {
      throw new MissingParamError('offset')
    }

    const ordersModel = await MongoHelper.getCollection('orders')

    const orders = await ordersModel
      .aggregate([
        { $limit: limit },
        { $skip: (offset - 1) * limit },
        {
          $lookup: {
            from: 'users',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer'
          }
        },
        { $sort: { createdAt: -1 } }

      ])
      .toArray()

    return orders
  }
}
