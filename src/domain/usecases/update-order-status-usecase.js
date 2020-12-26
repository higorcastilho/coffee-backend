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

    if (success && !canceled) {
      this.orderStatus = 1
    }

    if (!success && canceled) {
      this.orderStatus = 0
    }

    const response = await this.updateOrderStatusRepository.update(this.orderStatus, orderId)
    return response
  }
}
