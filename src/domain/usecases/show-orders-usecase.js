const { MissingParamError } = require('../../utils/errors')

module.exports = class ShowOrdersUseCase {
  constructor (showOrdersRepository) {
    this.showOrdersRepository = showOrdersRepository
  }

  async show (limit, offset) {
    if (!limit) {
      throw new MissingParamError('limit')
    }

    if (!offset) {
      throw new MissingParamError('offset')
    }

    const orders = await this.showOrdersRepository.show(limit, offset)
    return orders
  }
}
