const { MissingParamError } = require('../../utils/errors')

module.exports = class ManageOrderInfoUseCase {
  constructor (createOrderRepository) {
    this.createOrderRepository = createOrderRepository
  }

  async createOrder (paymentMethod, price, quantity, orderStatus, customerId) {
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

    const order = await this.createOrderRepository.create(paymentMethod, price, quantity, orderStatus, customerId)
    return order
  }
}
