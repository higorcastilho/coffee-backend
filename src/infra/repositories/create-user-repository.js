const MongoHelper = require('../helpers/mongo-helper')
const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = class CreateUserRepository {
  async create (name, email, phone, address, zip) {
    if (!name) {
      throw new MissingParamError('name')
    }

    if (!email) {
      throw new MissingParamError('email')
    }

    if (!phone) {
      throw new MissingParamError('phone')
    }

    if (!address) {
      throw new MissingParamError('address')
    }

    if (!zip) {
      throw new MissingParamError('zip')
    }

    const userModel = await MongoHelper.getCollection('users')
    const user = await userModel.insertOne({
      name,
      email,
      phone,
      address,
      zip
    })

    return user
  }
}
