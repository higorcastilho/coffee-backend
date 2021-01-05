const { MissingParamError } = require('../../utils/errors')

module.exports = class ManageCustomerUsecase {
  constructor (loadUserByEmailRepository, createUserRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.createUserRepository = createUserRepository
  }

  async returnOrCreateCustomer (name, email, phone, address, zip) {
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

    const customer = await this.loadUserByEmailRepository.load(email)

    if (!customer) {
      const customer = await this.createUserRepository.create(name, email, phone, address, zip)

      return customer.ops[0]
    }

    return customer
  }
}
