const MissingParamError = require('../../utils/errors/missing-param-error')
module.exports = class StripeUseCase {
  constructor ({ stripeService } = {}) {
    this.stripeService = stripeService
  }

  async pay (value, quantity, currency, orderId) {
    if (!value) {
      throw new MissingParamError('value')
    }

    if (!quantity) {
      throw new MissingParamError('quantity')
    }

    if (!currency) {
      throw new MissingParamError('currency')
    }

    if (!orderId) {
      throw new MissingParamError('orderId')
    }

    const sessionId = await this.stripeService.createOrder(value, quantity, currency, orderId)
    return sessionId
  }
}
