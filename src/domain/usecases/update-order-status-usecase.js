const { MissingParamError } = require('../../utils/errors')

module.exports = class UpdateOrderStatusUseCase {
  constructor (updateOrderStatusRepository, orderStatus = 0) {
    this.updateOrderStatusRepository = updateOrderStatusRepository
    this.orderStatus = orderStatus
  }

  async update (success, canceled, orderId) {
    if (!success) {
      throw new MissingParamError('success')
    }

    if (!canceled) {
      throw new MissingParamError('canceled')
    }

    if (!orderId) {
      throw new MissingParamError('orderId')
    }

    if (success === 'true' && canceled === 'false') {
      this.orderStatus = 'sim'
    }

    if (success === 'false' && canceled === 'true') {
      this.orderStatus = 'não'
    }

    const response = await this.updateOrderStatusRepository.update(this.orderStatus, orderId)
    return response
  }
}
