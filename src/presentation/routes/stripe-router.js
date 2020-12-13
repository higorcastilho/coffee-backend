const HttpResponse = require('../helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

module.exports = class StripeRouter {
  constructor (stripeUseCase) {
    this.stripeUseCase = stripeUseCase
  }

  async route (httpRequest) {
    try {
      const { value, quantity, currency, orderId } = httpRequest.body
      if (!value) {
        return HttpResponse.badRequest(new MissingParamError('value'))
      }

      if (!quantity) {
        return HttpResponse.badRequest(new MissingParamError('quantity'))
      }

      if (!currency) {
        return HttpResponse.badRequest(new MissingParamError('currency'))
      }

      if (!orderId) {
        return HttpResponse.badRequest(new MissingParamError('orderId'))
      }

      const sessionId = await this.stripeUseCase.pay(value, quantity, currency, orderId)
      return HttpResponse.ok({ sessionId })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
