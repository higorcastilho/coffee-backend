const MissingParamError = require('../../utils/errors/missing-param-error')
const stripe = require('stripe')

module.exports = class StripeService {
  constructor (frontendDomain) {
    this.frontendDomain = frontendDomain
  }

  async createOrder (value, quantity, currency, orderId) {
    if (!value || !quantity || !currency || !orderId || !this.frontendDomain) {
      throw new MissingParamError('createOrder param is missing')
    }

    const session = await stripe.checkout.sessions.create(value, quantity, currency, orderId, this.frontendDomain)
    return session
  }
}
